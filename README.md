# Ease3D

Generate 3D models from text prompts using the **Tripo AI API** — with a clean web UI and a small Express backend that keeps your API key safe on the server.

## ✨ Features

- 📝 Text-to-3D model generation via Tripo AI
- 👁️ In-browser 3D model preview
- ⬇️ Download generated models
- 🔒 API key never exposed to the browser — all requests are proxied through the backend

## 🛠️ Tech Stack

- **Frontend:** Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express
- **AI Provider:** [Tripo3D API](https://platform.tripo3d.ai)

## 📋 Prerequisites

- Node.js 18 or newer
- A Tripo AI API key — create one for free at https://platform.tripo3d.ai

## 🚀 Getting Started

### 1. Clone the repository

    git clone https://github.com/mhmadrezapahlevi/Ease3D.git
    cd Ease3D

### 2. Install dependencies

    # Frontend
    npm install

    # Backend
    cd server
    npm install
    cd ..

### 3. Set up environment variables

Copy the example file, then fill in **your own** API key:

    # macOS / Linux
    cp server/.env.example server/.env

    # Windows PowerShell
    copy server\.env.example server\.env

Edit `server/.env`:

    TRIPO_API_KEY=tsk_your_real_key_here
    PORT=3003

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`. Only `.env.example` (with placeholder values) should be committed.

### 4. Run the app

    # Terminal 1 — backend (runs on http://localhost:3003)
    cd server
    npm run dev

    # Terminal 2 — frontend
    npm run dev

Open the URL shown by Vite (usually http://localhost:5173) in your browser.

## 📁 Project Structure

    Ease3D/
    ├── server/
    │   ├── index.js        # Express backend — proxies requests to Tripo AI
    │   ├── .env.example    # Environment template (no real secrets)
    │   └── .env            # Your local config — NOT committed
    ├── src/                # Frontend source code
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.ts
    └── README.md

## 🔒 Security Notes

- The Tripo API key lives **only** on the server. The frontend calls the local backend, and the backend forwards requests to Tripo AI with the key attached.
- If you ever accidentally commit a real key, revoke it immediately at https://platform.tripo3d.ai and clean your git history.

## 📄 License

This project is licensed under the MIT License — see LICENSE.txt for details.
