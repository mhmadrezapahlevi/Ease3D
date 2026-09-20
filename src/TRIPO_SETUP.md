# 🎨 Tripo AI Integration - Setup Guide

Panduan lengkap untuk mengintegrasikan Tripo AI ke Ease3D platform.

## 🔗 Link Penting Tripo AI

| Tujuan | Link |
|--------|------|
| 🏠 Website Utama | https://www.tripo3d.ai/ |
| 🔑 **Platform & API Keys** | **https://platform.tripo3d.ai/api-keys** |
| 📖 Dokumentasi API | https://platform.tripo3d.ai/docs |
| 💰 Pricing & Billing | https://platform.tripo3d.ai/docs/billing |
| 📚 Quick Start | https://platform.tripo3d.ai/docs/quick-start |
| 🎮 Generation API | https://platform.tripo3d.ai/docs/generation |

## 📋 Langkah-Langkah Setup

### Step 1: Daftar Akun Tripo

1. Buka **https://platform.tripo3d.ai/**
2. Klik **"Sign Up"** atau **"Log in"**
3. Daftar dengan email atau Google

### Step 2: Dapatkan API Key

1. Setelah login, buka **https://platform.tripo3d.ai/api-keys**
2. Klik **"Create API Key"**
3. Beri nama untuk API key (contoh: "Ease3D Backend")
4. **COPY API KEY** yang muncul (format: `tsk_xxxxxxxxxxxxx`)

⚠️ **PENTING**: API key hanya ditampilkan SEKALI! Simpan di tempat aman.

### Step 3: Setup Backend Server

Buka PowerShell/CMD di folder project:

```powershell
# Masuk ke folder server
cd C:\Users\asuss\ease3d\server

# Buat file .env dengan Notepad
notepad .env
```

Isi file `.env`:
```
TRIPO_API_KEY=tsk_Pv-3dec8OocYEd7doyrQuppzBjnim_5blsPCWp3BQ85
PORT=3001
```

(Ganti dengan API key asli Anda)

### Step 4: Install Backend Dependencies

```powershell
# Di folder server
npm install
```

### Step 5: Jalankan Backend

```powershell
# Di folder server
npm start
```

Anda akan melihat:
```
🚀 ========================================
   Tripo AI Backend running on port 3001
============================================
   Frontend: http://localhost:5173
   Backend:  http://localhost:3001
   API Key:  ✅ Configured
============================================
```

✅ **JANGAN tutup terminal ini!**

### Step 6: Jalankan Frontend (Terminal Baru)

```powershell
# Buka PowerShell baru
cd C:\Users\asuss\ease3d
npm run dev
```

Browser akan otomatis terbuka di http://localhost:5173

## 🎯 Cara Menggunakan

1. Buka http://localhost:5173
2. Klik menu **"Tripo AI"** di navigation bar
3. Pilih mode:
   - **Text to 3D**: Masukkan deskripsi teks
   - **Image to 3D**: Upload gambar
4. Pilih settings:
   - Model Version (v3.1, P1, v3.0)
   - Texture (on/off)
   - PBR Materials (on/off)
   - Negative Prompt (opsional)
5. Klik **"Generate 3D Model"**
6. Tunggu proses generate (~10-120 detik)
7. Download hasil GLB model

## 💰 Tripo AI Pricing

Check pricing terbaru di: https://platform.tripo3d.ai/docs/billing

### Model Versions:
- **v3.1-20260211**: Latest, best quality
- **P1-20260311**: Optimized for low-poly (games)
- **v3.0-20250812**: Stable version

### Features:
- ✅ Text to 3D
- ✅ Image to 3D
- ✅ Multiview to 3D
- ✅ PBR Textures
- ✅ Quad Mesh
- ✅ Refine Model

## ⚠️ Penting: Model URL Expire

**Model URLs expire after 5 minutes!** Download immediately after generation.

## 🔧 Troubleshooting

### Backend tidak bisa connect

**Error**: "Backend Server Not Running"

**Solusi**:
1. Pastikan backend server sudah dijalankan: `cd server && npm start`
2. Check apakah port 3001 sudah digunakan
3. Check console browser untuk error details

### API Key Invalid

**Error**: "Tripo API key not configured" atau "Unauthorized"

**Solusi**:
1. Check file `server/.env` sudah ada dan berisi `TRIPO_API_KEY`
2. Pastikan API key valid (check di Tripo dashboard)
3. Restart backend server setelah mengubah `.env`

### Generation Failed

**Solusi**:
1. Check koneksi internet
2. Check credit balance di Tripo dashboard
3. Check console backend untuk error details
4. Coba prompt yang lebih sederhana

### Model URL Expired

Jika model URL sudah expired:
1. Generate ulang model
2. Download segera setelah generation selesai
3. URL hanya berlaku 5 menit

## 📁 Struktur File

```
ease3d/
├── server/                    # Backend server
│   ├── index.js              # Express server + Tripo API
│   ├── .env                  # API key (JANGAN commit ke Git!)
│   └── package.json          # Backend dependencies
│
├── src/
│   ├── services/
│   │   └── tripo.ts          # Frontend API service
│   ├── pages/
│   │   └── TripoStudio.tsx   # Tripo AI Studio page
│   └── ...
│
└── .env                      # Frontend environment variables
```

## 🔐 Security Notes

⚠️ **PENTING**:
- Jangan commit file `.env` ke Git
- Jangan share API key Anda
- File `.env` sudah ada di `.gitignore`

## 📚 API Documentation

Tripo API Documentation: https://platform.tripo3d.ai/docs

### Endpoints yang digunakan:

- `POST /v2/openapi/task` - Create generation task
- `GET /v2/openapi/task/{taskId}` - Check task status
- `POST /v2/openapi/upload` - Upload image

## 🆘 Support

- Tripo Platform: https://platform.tripo3d.ai/contact-us
- API Docs: https://platform.tripo3d.ai/docs
- Status Page: https://tripo3d.statuspage.io/

---

**Happy 3D Generating! 🎨✨**
