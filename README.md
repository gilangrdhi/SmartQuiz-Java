# Project Context: SmartQuiz (Java CLI)

## Deskripsi
SmartQuiz adalah aplikasi kuis edukasi berbasis Java. Untuk Tahap 1, aplikasi ini dibangun menggunakan antarmuka Console/CLI, sebelum nantinya dikembangkan menggunakan Database MySQL dan arsitektur Multi-User.

## Tech Stack
- Bahasa: Java 17
- Build Tool & Dependency Manager: Maven
- Version Control: Git & GitHub

## Arsitektur & Struktur Folder
Aplikasi ini menggunakan adaptasi pola MVC (Model-View-Controller) / N-Tier Architecture untuk memisahkan tanggung jawab:
- `model/`: Entity/Class untuk representasi data (contoh: Question, User).
- `repository/`: Bertanggung jawab untuk akses data (CRUD ke memori sementara atau MySQL).
- `service/`: Berisi business logic (menghitung nilai, mengacak soal, validasi jawaban).
- `view/`: Menangani antarmuka terminal (System.out.print dan Scanner untuk input user).
- `utils/`: Class bantuan (helper) seperti koneksi database atau format tampilan.

## Aturan Ngoding (Coding Guidelines)
1. Wajib menggunakan pilar OOP dengan benar (Encapsulation, dll).
2. Tulis kode yang Clean dan Scalable.
3. Nama variabel dan method menggunakan format `camelCase`, nama Class menggunakan `PascalCase`.
4. Jika memberikan solusi kode, jelaskan alur data dan hubungannya dengan class lain secara bertahap.