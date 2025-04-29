#!/bin/bash

echo "🚀 Starting full project setup..."

# Go to server
cd server
echo "📦 Installing backend dependencies..."
npm install

# Copy .env file if not exists
if [ ! -f .env ]; then
  echo "🔐 Copying .env.example to .env..."
  cp .env.example .env
fi

cd ..

# Go to client
cd client
echo "📦 Installing frontend dependencies..."
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "📦 To start backend: cd server && node server.js"
echo "🌐 To start frontend: cd client && npm start"
