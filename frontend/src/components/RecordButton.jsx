import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

export function RecordButton({ isRecording, onClick, onTranscription }) {
  const [socket, setSocket] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Configure socket connection
  const newSocket = io("http://localhost:8000", {
    transports: ['websocket', 'polling'],
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  useEffect(() => {
    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("transcription", (transcription) => {
      console.log("Received transcription:", transcription);
      if (onTranscription && typeof onTranscription === 'function') {
        onTranscription(transcription);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const onStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket) {
          event.data.arrayBuffer().then(buffer => {
            const float32Array = new Float32Array(buffer);
            socket.emit("audio", float32Array);
          });
        }
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      onClick();  // Call the parent's onClick handler
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onStop = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      onClick();  // Call the parent's onClick handler
    }
  };

  return (
    <Button
      onClick={isRecording ? onStop : onStart}
      variant={isRecording ? "destructive" : "default"}
    >
      {isRecording ? (
        <StopCircle className="mr-2 h-4 w-4" />
      ) : (
        <Mic className="mr-2 h-4 w-4" />
      )}
      {isRecording ? "Stop Recording" : "Start Recording"}
    </Button>
  );
}