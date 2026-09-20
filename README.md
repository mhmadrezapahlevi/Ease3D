# 🎨 Ease3D - Tripo AI Integration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI 3D Generation Platform with a **fully working Tripo AI** integration!

## ✨ Features

- ✅ **Text to 3D** — Generate 3D models from text prompts
- ✅ **Image to 3D** — Generate 3D models from images
- ✅ **Multiple Model Versions** — v3.1, P1 (low-poly), v3.0
- ✅ **PBR Textures** — Physically-based materials
- ✅ **Real-time Preview** — Watch generation progress live
- ✅ **3D Viewer** — Preview 3D models directly in the browser
- ✅ **GLB Download** — Download models in GLB format

## 🚀 Quick Start

### 1. Setup Backend

```powershell
# Navigate to the server folder
cd server

# Install dependencies
npm install

# The .env file already contains your API key
# If not, create it with: notepad .env
# Add: TRIPO_API_KEY=tsk_YOUR_API_KEY_HERE

# Start the backend server
npm start
```

### 2. Setup Frontend (New Terminal)

```powershell
# From the project root folder
npm install
npm run dev
```

### 3. Open the Browser

Go to http://localhost:5173 and click the **"Tripo AI"** menu.

## 📖 Full Documentation

See [TRIPO_SETUP.md](./TRIPO_SETUP.md) for the complete guide.

## 🔗 Important Tripo AI Links

| Purpose | Link |
|---------|------|
| 🔑 **API Keys** | **https://platform.tripo3d.ai/api-keys** |
| 📖 Documentation | https://platform.tripo3d.ai/docs |
| 💰 Pricing | https://platform.tripo3d.ai/docs/billing |

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Three.js + React Three Fiber
- Zustand (state management)

### Backend
- Node.js + Express
- Axios (HTTP client)
- Multer (file upload)
- Form-Data (multipart upload)

## 🎯 How to Use

### Text to 3D
1. Click the "Tripo AI" menu
2. Select the "Text to 3D" tab
3. Enter a description (e.g., "A medieval castle")
4. Choose a model version and settings
5. Click "Generate 3D Model"
6. Download the resulting GLB file

### Image to 3D
1. Click the "Tripo AI" menu
2. Select the "Image to 3D" tab
3. Upload an image (JPG, PNG, WebP, max 20MB)
4. Choose a model version and settings
5. Click "Generate 3D Model"
6. Download the resulting GLB file

## ⚠️ Important

- **Model URLs expire after 5 minutes** — Download immediately after generation
- **Backend must be running** — Do not close the backend terminal
- **API key is already configured** — In the `server/.env` file

## 📁 Project Structure

```
ease3d/
├── server/                 # Backend server
│   ├── index.js           # Express + Tripo API
│   ├── .env               # API key
│   └── package.json
│
├── src/
│   ├── services/
│   │   └── tripo.ts       # Tripo API service
│   ├── pages/
│   │   ├── TripoStudio.tsx # Tripo AI page
│   │   └── ...
│   └── ...
│
└── README.md
```

## 🔧 Troubleshooting

### Backend not connecting?
```powershell
cd server
npm start
```

### API key invalid?
```powershell
# Edit the server/.env file
notepad .env
# Make sure TRIPO_API_KEY is correct
```

### Generation failed?
- Check your internet connection
- Check your credit balance on the Tripo dashboard
- Check the backend console for errors

## 📚 Resources

- [Tripo Platform](https://platform.tripo3d.ai/)
- [Tripo API Docs](https://platform.tripo3d.ai/docs)
- [Setup Guide](./TRIPO_SETUP.md)

## 🚧 Future Enhancements

- [ ] Integrate Meshy AI
- [ ] Integrate Rodin AI
- [ ] Multiview to 3D
- [ ] Model refinement
- [ ] Batch processing
- [ ] User authentication
- [ ] Payment system

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
```

