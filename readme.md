# AI Notetaker

A real-time speech-to-text transcription and summarization tool that converts spoken words into organized notes.

## Features

- 🎙️ Real-time audio transcription using Google Cloud Speech-to-Text
- 📝 Automatic summarization using Facebook's BART model
- 🖥️ React frontend with Vite for fast development
- ⚡ FastAPI backend for efficient processing
- 📱 Responsive UI with Tailwind CSS

## How It Works

1. **Audio Capture**: Frontend captures microphone input using Web Audio API
2. **Stream Processing**: Audio chunks are sent to backend via Socket.IO
3. **Transcription**: Google Cloud Speech-to-Text converts speech to text
4. **Summarization**: BART model generates concise bullet-point notes
5. **Display**: Results shown in a tabbed interface (live captions/summary)

## Tech Stack

### Frontend
- React
- Socket.IO client
- Web Audio API

### Backend
- FastAPI
- Google Cloud Speech-to-Text
- HuggingFace Transformers (BART model)
- Socket.IO server
- Uvicorn ASGI server
