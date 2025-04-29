# 🎧 Audio Transcription App

A full-stack web application to upload, merge, and transcribe audio files using Deepgram API.

## 🔧 Features
- Upload multiple audio files
- Merge audio files into one
- Transcribe audio using Deepgram
- Audio player for playback (HTML5 player)
- Supports Indonesian (`language: 'id'`)

## 🚀 Tech Stack
- Frontend: React
- Backend: Express (Node.js)
- Audio Processing: FFmpeg (`fluent-ffmpeg`)
- Transcription: Deepgram API

## 📦 Project Structure

```
audio-transcription-app/
├── client/         # React frontend
├── server/         # Express backend
├── deploy.sh       # One-click setup script
├── .env.example    # Sample environment variables
├── README.md       # Project instructions
```

## ⚙️ Setup & Deployment

1. Clone the repository:
```bash
git clone https://github.com/your-username/audio-transcription-app.git
cd audio-transcription-app
```

2. Make the deploy script executable:
```bash
chmod +x deploy.sh
```

3. Run the full setup:
```bash
./deploy.sh
```

4. To start the app:
```bash
# Start backend
cd server
node server.js

# Start frontend
cd ../client
npm start
```

## 🔐 Environment Setup

Copy `.env.example` to `.env` in the `server/` folder and fill in your Deepgram API key.

```
DEEPGRAM_API_KEY=your_actual_api_key
PORT=5000
```

## 🙌 Credits
Made with ❤️ by Hendri Permana
