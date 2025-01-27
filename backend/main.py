import os
import asyncio
import queue
import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from google.cloud import speech
from settings import *

# Google Cloud Speech-to-Text client
speech_client = speech.SpeechClient()

# FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Socket.IO server
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])
socket_app = socketio.ASGIApp(sio, app)

# Store client data
clients = {}


class ClientData:
    def __init__(self, sid, conn, config):
        self.sid = sid
        self.conn = conn
        self.audio_queue = queue.Queue()
        self.transcription_thread = None
        self.is_recording = False
        self.config = config

    def start_transcription(self):
        self.is_recording = True
        self.transcription_thread = threading.Thread(
            target=self.transcribe_audio)
        self.transcription_thread.start()

    def stop_transcription(self):
        self.is_recording = False
        self.audio_queue.put(None)  # Signal the thread to stop
        if self.transcription_thread:
            self.transcription_thread.join()

    def transcribe_audio(self):
        # Google Cloud Speech-to-Text streaming configuration
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=self.config["audio"]["sampleRateHertz"],
            language_code=self.config["audio"]["languageCode"],
            enable_automatic_punctuation=True,
        )
        streaming_config = speech.StreamingRecognitionConfig(
            config=config, interim_results=self.config["interimResults"]
        )

        # Audio generator
        def audio_generator():
            while self.is_recording:
                chunk = self.audio_queue.get()
                if chunk is None:
                    break
                yield speech.StreamingRecognizeRequest(audio_content=chunk)

        # Start streaming
        requests = audio_generator()
        responses = speech_client.streaming_recognize(
            streaming_config, requests)

        # Process responses
        for response in responses:
            if not response.results:
                continue
            result = response.results[0]
            if not result.alternatives:
                continue
            transcript = result.alternatives[0].transcript
            is_final = result.is_final

            # Send transcription back to the client
            asyncio.run(self.conn.emit("speechData", {
                        "data": transcript, "isFinal": is_final}))

    def add_audio_data(self, data):
        self.audio_queue.put(data)

# Socket.IO event handlers


@sio.on("connect")
async def connect(sid, environ):
    print(f"Client connected: {sid}")


@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    if sid in clients:
        clients[sid].stop_transcription()
        del clients[sid]


@sio.on("startGoogleCloudStream")
async def start_stream(sid, config):
    print(f"Starting transcription for client: {sid}")
    clients[sid] = ClientData(sid, sio, config)
    clients[sid].start_transcription()


@sio.on("binaryAudioData")
async def receive_audio_data(sid, data):
    if sid in clients:
        clients[sid].add_audio_data(data)


@sio.on("endGoogleCloudStream")
async def end_stream(sid):
    print(f"Stopping transcription for client: {sid}")
    if sid in clients:
        clients[sid].stop_transcription()

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=10000)
