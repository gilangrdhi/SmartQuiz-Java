# 🎯 SmartQuiz - Interactive Learning Platform

SmartQuiz adalah aplikasi kuis interaktif berbasis web (Full-Stack) yang dirancang untuk memberikan pengalaman belajar yang gamified dan menyenangkan. Proyek ini memisahkan layanan menjadi dua bagian utama: **Front-End** berbasis React dan **Back-End** berbasis Java Spring Boot.

## 🚀 Tech Stack

**Front-End (`smartquiz-web`):**
*   **Library & Build Tool:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Ant Design](https://ant.design/)
*   **State & API Handling:** React Hooks (terdapat *custom hooks* seperti `useSubmitQuizResult`)
*   **Routing:** React Router DOM (Halaman Dashboard, Login, Profile, Quiz List, Quiz Room)

**Back-End (`smartquiz-api`):**
*   **Framework:** [Spring Boot](https://spring.io/projects/spring-boot) (Java)
*   **Build Tool:** Maven (`mvnw`)
*   **Arsitektur:** MVC (Model-View-Controller) pattern dengan pemisahan pada folder `controller`, `model`, `repository`, dan `dto`.

## ✨ Fitur Utama

*   **Interactive Quiz Room:** Halaman kuis dinamis dengan maskot interaktif (Pak Elio) yang merespons jawaban.
*   **Kustomisasi Avatar:** Pengguna dapat menyesuaikan avatar mereka (warna, pose, jenis topi, dan ukurannya).
*   **Sistem Skor & Dashboard:** Perhitungan skor kuis, persentase kemenangan, dan tampilan riwayat pada dasbor pengguna.
*   **Modular REST API:** Endpoint backend terstruktur rapi untuk *Quiz*, *Question*, *User*, dan *Avatar*.

## 🚧 Fitur Mendatang (On Progress)

Aplikasi ini masih terus dikembangkan! Berikut adalah beberapa fitur gamifikasi dan fungsionalitas tambahan yang sedang dikerjakan:

*   ⏳ **Timer & Buff System:** Penambahan logika waktu mundur (*timer*) saat mengerjakan soal, serta penggunaan item *Buff* (gamifikasi) agar suasana kuis jadi jauh lebih seru, interaktif, dan menegangkan.
*   📊 **User Statistics:** Perekaman dan penampilan data statistik hasil kuis secara komprehensif langsung di halaman Profil pengguna.
*   👨‍🏫 **Teacher Dashboard:** Pembuatan halaman khusus Guru/Admin untuk melakukan manajemen kuis dan CRUD (Create, Read, Update, Delete) bank soal dengan mudah.

## 📂 Struktur Proyek

```text
gilangrdhi-smartquiz-java/
├── smartquiz-api/                # ☕ BACK-END (Spring Boot)
│   ├── mvnw / mvnw.cmd           # Maven Wrapper
│   ├── pom.xml                   # Konfigurasi dependensi Maven
│   ├── src/main/java/.../smartquiz_api/
│   │   ├── controller/           # Endpoint REST API (Avatar, Question, Quiz, User)
│   │   ├── dto/                  # Data Transfer Objects (QuizResultRequest)
│   │   ├── model/                # Entitas Database (AvatarPayload, Question, Quiz, User)
│   │   ├── repository/           # Antarmuka query ke Database
│   │   └── SmartquizApiApplication.java
│   └── src/main/resources/
│       └── application.properties # Konfigurasi server & database
│
└── smartquiz-web/                # ⚛️ FRONT-END (React + Vite)
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── api/                  # Custom hooks & API calls
        ├── components/           # Komponen UI Reusable (Navbar, AvatarCustomizer, dll)
        ├── pages/                # Halaman utama aplikasi (Dashboard, QuizRoom, dll)
        ├── utils/                # Fungsi helper & styling kategori kuis
        ├── App.jsx               # Setup routing
        └── main.jsx              # Entry point React
```

## ⚙️ Cara Instalasi & Menjalankan Secara Lokal

Pastikan komputer kamu sudah terinstal **Java (JDK 17+)**, **Node.js**, dan database yang sesuai dengan konfigurasi di `application.properties`.

1.  **Setup & Jalankan Back-End (`smartquiz-api`)**
    Buka terminal dan arahkan ke folder backend:
    ```bash
    cd smartquiz-api
    
    # Jika menggunakan Windows:
    mvnw spring-boot:run
    
    # Jika menggunakan Mac/Linux:
    ./mvnw spring-boot:run
    ```
    *Server API biasanya akan berjalan di `http://localhost:8080` (tergantung konfigurasi port di properties).*

2.  **Setup & Jalankan Front-End (`smartquiz-web`)**
    Buka terminal baru dan arahkan ke folder frontend:
    ```bash
    cd smartquiz-web
    
    # Install semua dependensi
    npm install
    
    # Jalankan development server
    npm run dev
    ```
    *Buka browser dan akses URL yang diberikan oleh Vite (biasanya `http://localhost:5173`).*

## 👨‍💻 Author

**Gilang Ardhi Maulana**
*   GitHub: [@gilangrdhi](https://github.com/gilangrdhi)

---
*Dibuat untuk memberikan pengalaman kuis teknis yang responsif dan interaktif.*
