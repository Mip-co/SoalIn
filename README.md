# 🎓 Pembuat Soal AI — Untuk Guru

Aplikasi web untuk membuat soal ujian otomatis menggunakan AI (Google Gemini).
Upload kisi-kisi PDF/DOCX atau ketik manual, atur jenis soal, dan download hasilnya dalam format Word.

---

## 📁 Struktur Project

```
question-generator/
├── backend/    → Node.js + Express + TypeScript
└── frontend/   → React + Vite + TypeScript + Tailwind
```

---

## ⚡ Cara Menjalankan (Langkah demi Langkah)

### 1. Dapatkan Gemini API Key

1. Buka https://aistudio.google.com/app/apikey
2. Login dengan akun Google
3. Klik **"Create API Key"**
4. Salin API key-nya

---

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Buat file .env dari template
cp .env.example .env
```

Buka file `.env` lalu isi API key:
```
GEMINI_API_KEY=isi_api_key_gemini_anda_di_sini
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Jalankan backend:
```bash
npm run dev
```

Backend akan berjalan di: **http://localhost:5000**

---

### 3. Setup Frontend

Buka terminal baru (jangan tutup terminal backend):

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

---

### 4. Buka di Browser

Buka **http://localhost:5173** di browser Anda.

---

## 🔧 Persyaratan

- **Node.js** versi 18 atau lebih baru
- **npm** versi 8 atau lebih baru
- Koneksi internet (untuk AI Gemini)

Cek versi Node.js:
```bash
node --version
```

Jika belum punya Node.js, download di: https://nodejs.org

---

## 🚀 Fitur

- ✅ Upload PDF atau DOCX kisi-kisi
- ✅ Ketik kisi-kisi manual
- ✅ Generate soal Pilihan Ganda, Essay, dan Benar/Salah
- ✅ Atur kelas dan tingkat kesulitan
- ✅ Edit soal hasil generate
- ✅ Generate ulang soal tertentu
- ✅ Download hasil dalam format Word (.docx)
- ✅ Opsional sertakan kunci jawaban

---

## ❗ Troubleshooting

**Backend error "GEMINI_API_KEY tidak ditemukan"**
→ Pastikan file `.env` sudah dibuat dan API key sudah diisi

**Frontend tidak bisa konek ke backend**
→ Pastikan backend sudah berjalan di port 5000

**Error saat install npm**
→ Coba hapus folder `node_modules` lalu jalankan `npm install` lagi

**Soal gagal digenerate**
→ Cek apakah API key Gemini valid dan masih memiliki quota
