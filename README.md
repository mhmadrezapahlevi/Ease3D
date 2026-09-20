# 🎨 Ease3D - Tripo AI Integration

Platform AI 3D Generation dengan integrasi **Tripo AI** yang sudah berfungsi!

## ✨ Fitur

- ✅ **Text to 3D** - Generate 3D model dari deskripsi teks
- ✅ **Image to 3D** - Generate 3D model dari gambar
- ✅ **Multiple Model Versions** - v3.1, P1 (low-poly), v3.0
- ✅ **PBR Textures** - Material berbasis fisika
- ✅ **Real-time Preview** - Lihat progress generation
- ✅ **3D Viewer** - Preview model 3D langsung di browser
- ✅ **GLB Download** - Download model dalam format GLB

## 🚀 Quick Start

### 1. Setup Backend

```powershell
# Masuk ke folder server
cd server

# Install dependencies
npm install

# File .env sudah ada dengan API key Anda
# Jika belum, buat dengan: notepad .env
# Isi: TRIPO_API_KEY=tsk_YOUR_API_KEY_HERE

# Start backend server
npm start
```

### 2. Setup Frontend (Terminal Baru)

```powershell
# Di root folder project
npm install
npm run dev
```

### 3. Buka Browser

Buka http://localhost:5173 dan klik menu **"Tripo AI"**

## 📖 Dokumentasi Lengkap

Lihat [TRIPO_SETUP.md](./TRIPO_SETUP.md) untuk panduan lengkap.

## 🔗 Link Penting Tripo AI

| Tujuan | Link |
|--------|------|
| 🔑 **API Keys** | **https://platform.tripo3d.ai/api-keys** |
| 📖 Dokumentasi | https://platform.tripo3d.ai/docs |
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

## 🎯 Cara Menggunakan

### Text to 3D
1. Klik menu "Tripo AI"
2. Pilih tab "Text to 3D"
3. Masukkan deskripsi (contoh: "A medieval castle")
4. Pilih model version dan settings
5. Klik "Generate 3D Model"
6. Download hasil GLB

### Image to 3D
1. Klik menu "Tripo AI"
2. Pilih tab "Image to 3D"
3. Upload gambar (JPG, PNG, WebP, max 20MB)
4. Pilih model version dan settings
5. Klik "Generate 3D Model"
6. Download hasil GLB

## ⚠️ Penting

- **Model URLs expire after 5 minutes** - Download segera setelah generate
- **Backend harus running** - Jangan tutup terminal backend
- **API key sudah dikonfigurasi** - Di file `server/.env`

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

### Backend tidak connect?
```powershell
cd server
npm start
```

### API key invalid?
```powershell
# Edit file server/.env
notepad .env
# Pastikan TRIPO_API_KEY sudah benar
```

### Generation failed?
- Check koneksi internet
- Check credit balance di Tripo dashboard
- Check console backend untuk error

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

# Ease3D

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
