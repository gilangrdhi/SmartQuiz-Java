# SmartQuiz - Gamified Educational Platform 🚀

## Deskripsi
SmartQuiz adalah aplikasi kuis edukasi interaktif berbasis web. Berawal dari aplikasi Java CLI sederhana, proyek ini telah berevolusi menjadi platform Full-Stack modern yang mengedepankan *gamification*. 

Bukan sekadar kuis biasa, SmartQuiz menghadirkan pengalaman belajar yang asik dengan fitur *login* sosial, kustomisasi avatar awan bergaya *Among Us*, sistem *buff/power-up* ala Quizizz, serta dipandu oleh maskot Guru Rusa yang interaktif!

## 🎨 UI/UX & Color Palette
Aplikasi ini didesain dengan antarmuka yang ramah dan menyenangkan, menggunakan palet warna utama:
- **Dark Blue** (`#2c5ead`): Teks & Elemen Utama
- **Medium Blue** (`#1591dc`): Primary Buttons & Aksen
- **Light Blue** (`#4bb8fa`): Avatar & Interaksi Hover
- **Pale Blue** (`#c4e2f5`): Background Aplikasi

## 🛠️ Tech Stack Utama
**Frontend (Web Client):**
- React.js (Vite)
- Tailwind CSS / Ant Design (UI Framework & Styling)
- React Query (Data Fetching & State Management)

**Backend (RESTful API):**
- Java 17 & Spring Boot
- Spring Data JPA
- Database: MySQL
- Autentikasi: Google OAuth 2.0 (SSO)

## 📁 Arsitektur & Struktur Monorepo
Proyek ini menggunakan pendekatan Monorepo yang memisahkan aplikasi ke dalam beberapa lingkungan:

1. `smartquiz-api/` (Backend - Spring Boot)
   - `model/`: Entity/Class representasi tabel database.
   - `repository/`: Mengelola akses data (Spring Data JPA) ke MySQL.
   - `controller/`: REST API Endpoints (Penerima request dari frontend).
   - *Berbasis arsitektur MVC / N-Tier modern.*

2. `smartquiz-web/` (Frontend - React)
   - *Akan berisi komponen UI interaktif, manajemen state avatar, dan logika permainan kuis.*

3. `smartquiz-cli/` (Legacy)
   - *Versi pertama aplikasi berbasis Terminal/Console sebagai sejarah pengembangan fundamental Java.*

## ✨ Fitur Utama (On Progress)
- [x] **CRUD Soal Kuis** (Terintegrasi dengan MySQL API)
- [ ] **Google Sign-In** (Akses masuk yang cepat dan aman)
- [ ] **Cloud Avatar Customizer** (Pemain bisa mengganti topi/aksesoris avatar awan)
- [ ] **Deer Teacher Guide** (Karakter rusa interaktif di halaman kuis)
- [ ] **Quizizz-style Buffs** (Sistem power-up saat menjawab soal)

## Aturan Pengembangan (Coding Guidelines)
1. Tulis kode yang *Clean*, *Scalable*, dan *Reusable*.
2. Pisahkan *logic* pengambilan data (React Query) dari komponen UI (Ant Design/Tailwind).
3. Penamaan variabel/method menggunakan `camelCase`, Class/Komponen menggunakan `PascalCase`.
4. Selalu utamakan pengalaman pengguna (UX) yang responsif dan interaktif.