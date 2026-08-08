# Toko Berkah Ibu Aries — Sprint 1 (PAWAntara)

Fondasi website toko sembako menggunakan Express + EJS + Tailwind CDN.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Server berjalan di: http://localhost:3000

## Struktur Folder

```
tokoberkah/
├── app.js                  # Entry point server Express
├── package.json
├── data/
│   └── products.js         # Data dummy produk (array of object)
├── public/
│   ├── css/style.css       # Styling tambahan + media query
│   └── js/main.js          # Vanilla JS toggle hamburger menu
└── views/
    ├── partials/
    │   ├── navbar.ejs
    │   └── footer.ejs
    ├── index.ejs            # GET /
    ├── produk.ejs            # GET /produk (?kategori=&search=)
    ├── detail.ejs            # GET /produk/:id
    ├── tanya-ai.ejs           # GET /tanya-ai
    └── 404.ejs                # fallback halaman/route tidak ditemukan
```

## Daftar Route

| Method | Route             | Keterangan                                   |
|--------|-------------------|-----------------------------------------------|
| GET    | `/`               | Beranda — hero + preview produk               |
| GET    | `/produk`         | Daftar produk + filter `?kategori=` `?search=`|
| GET    | `/produk/:id`     | Detail produk (404 rapi jika tidak ditemukan) |
| GET    | `/tanya-ai`       | Halaman chat UI (belum ada logic AI)          |
| GET    | `/api/products`   | REST API JSON read-only seluruh produk        |

## Catatan

- Tidak ada integrasi API AI eksternal.
- Belum menggunakan database — data disimpan di `data/products.js`.
- Styling menggunakan Tailwind CSS via CDN + sedikit CSS custom (`public/css/style.css`).


# 🛒 Toko Berkah Ibu Aries — Sprint 2

Website **Toko Berkah Ibu Aries** merupakan project pengembangan website toko sembako yang dilanjutkan dari Sprint 1. Pada Sprint 2, website dikembangkan agar lebih interaktif dan dinamis dengan menambahkan sistem autentikasi admin, manajemen CRUD produk via REST API, dashboard admin, serta fitur **Tanya AI** dengan sistem respons *dummy* (keyword matching) yang diproses sepenuhnya di backend Express.

---

## 👨‍💻 Informasi Project

| Informasi | Detail |
| :--- | :--- |
| **Nama Project** | Toko Berkah Ibu Aries |
| **Sprint** | Sprint 2 |
| **Mata Kuliah** | Pengembangan Aplikasi Web |
| **Backend** | Node.js + Express.js |
| **Template Engine** | EJS (Embedded JavaScript) |
| **Penyimpanan Data** | Data In-Memory / File JSON (`data/products.json`) |
| **Authentication** | Express Session (`express-session`) |
| **Frontend** | HTML5, Tailwind CSS, Vanilla JavaScript |
| **Komunikasi Data** | Fetch API dengan `async/await` |
| **AI Module** | Custom Dummy AI (Keyword Matching / Rules-based di Backend) |
| **Repository** | Continuation dari Repository Sprint 1 (`PAWAntara-[Kelas]-UCP1-[NIM]`) |

---

## 📌 Fitur Utama Sprint 2

### 1. 🔐 Sistem Autentikasi Admin (Login & Logout)
* **Login Admin**: Menggunakan form login (username & password) dengan validasi data di backend.
* **Session Management**: Menggunakan `express-session` dan cookie untuk menyimpan status autentikasi.
* **Logout**: Menghapus session aktif sehingga dashboard dan API terproteksi tidak bisa diakses kembali tanpa login.
* **Endpoints**:
  * `POST /api/login` — Autentikasi akun admin.
  * `POST /api/logout` — Menghapus session login.

### 2. 🛡️ Custom Middleware (Auth & Logger)
* **Auth Middleware (`middleware/auth.js`)**:
  * `requireAuthPage`: Melindungi halaman `/dashboard`. Jika belum login, otomatis di-*redirect* ke `/login`.
  * `requireAuthApi`: Melindungi endpoint mutasi (`POST`, `PUT`, `DELETE /api/products`). Jika di-hit tanpa login (misal via Postman), server mengembalikan respon `401 Unauthorized`.
* **Logger Middleware (`middleware/logger.js`)**:
  * Mencatat setiap *incoming request* yang masuk ke server (mencakup `HTTP Method`, `Endpoint`, dan `Timestamp` waktu request) dan menampilkannya di terminal.

### 3. 📦 REST API & CRUD Produk
Seluruh komunikasi data produk diakses secara dinamis via Fetch API `async/await` dengan format JSON yang konsisten.
* `GET /api/products` — Mengambil seluruh daftar produk (Public).
* `GET /api/products/:id` — Mengambil detail 1 produk (Public).
* 🔒 `POST /api/products` — Menambah produk baru (Wajib Login).
* 🔒 `PUT /api/products/:id` — Mengubah nama, harga, stok, atau kategori produk (Wajib Login).
* 🔒 `DELETE /api/products/:id` — Menghapus produk dari sistem (Wajib Login).

### 4. 🖥️ Dashboard Admin
* Halaman khusus Ibu Aries/Kasir untuk mengelola inventaris sembako.
* Menggunakan **Fetch API** (`async/await`) tanpa *full page reload* tradisional.
* Perubahan data (stok, harga, produk baru) di Dashboard langsung terhubung ke sumber data yang sama dengan Halaman Produk Publik.

### 5. 🛍️ Halaman Produk Publik Dinamis
* Mengambil data produk secara asynchronous dari `GET /api/products`.
* Tidak lagi menggunakan *hardcoded data* atau pembacaan file terpisah di frontend/SSR render statis.
* Bebas diakses oleh pelanggan tanpa perlu login.

### 6. 🤖 Fitur Tanya AI (Dummy AI Backend)
* Fitur asisten virtual tanpa menggunakan API AI eksternal (OpenAI/Gemini/dll).
* Seluruh logika pemrosesan pesan dilakukan di backend Express menggunakan *keyword matching* / *rule-based response*.
* **Topik yang Direspons**: Jam buka toko, biaya/layanan pengiriman (ongkir), metode pembayaran, dan ketersediaan stok.
* **Endpoint**: `POST /api/chat`
* **Frontend**: Halaman `/tanya-ai` mengirimkan pesan via `fetch()` dan merender *bubble chat* pesan pelanggan & balasan AI secara dinamis ke DOM.

### 7. 🏷️ Validasi Input Frontend
* Validasi JavaScript di sisi klien untuk mencegah pengiriman data kosong (*empty submit*):
  * **Form Login**: Memastikan username dan password telah diisi.
  * **Form Produk (Dashboard)**: Memastikan nama, harga, stok, dan kategori tidak kosong atau bernilai negatif.
  * **Form Tanya AI**: Memastikan pesan pertanyaan tidak berupa string kosong atau hanya spasi.

---

## 🔒 Keamanan & Environment

* **Environment Variables (`.env`)**:
  * File `.env` digunakan untuk menyimpan *sensitive data* seperti `PORT` dan `SESSION_SECRET`.
  * **PENTING**: File `.env` dan folder `node_modules/` **TIDAK DI-PUSH** ke repository GitHub sesuai konfigurasi di `.gitignore`.
* **Proteksi Password**: Password admin tidak di-commit secara *plain-text* di kode publik.

---

## 📁 Struktur Directory Project

```text
PAWAntara-[Kelas]-UCP1-[NIM]/
│
├── app.js                  # Entry point aplikasi Express.js
├── package.json            # Manifest project & dependensi npm
├── package-lock.json       # Lockfile dependensi
├── .gitignore              # Daftar file/folder yang diabaikan Git (.env, node_modules)
├── .env                    # Environment variables (TIDAK di-push ke Git)
│
├── middleware/             # Custom Middleware
│   ├── auth.js             # Middleware autentikasi (Page & API protection)
│   └── logger.js           # Middleware HTTP request logger
│
├── routes/                 # Express Routers
│   └── api/
│       ├── auth.js         # Router /api/login & /api/logout
│       ├── products.js     # Router REST API CRUD produk
│       └── chat.js         # Router /api/chat (Dummy AI)
│
├── data/                   # Sumber data terpusat
│   └── products.json       # Data produk terpusat (Shared Data Source)
│
├── public/                 # Static Assets
│   ├── css/                # Custom Stylesheets / Tailwind CSS output
│   ├── images/             # Asset gambar & logo
│   └── js/                 # Client-side JavaScript (Fetch API & DOM Manipulations)
│       ├── login.js        # Logic login & validasi frontend
│       ├── dashboard.js    # Logic CRUD produk via Fetch API
│       ├── produk.js       # Fetch dynamic products untuk halaman publik
│       └── chat.js         # Logic chat UI & Fetch /api/chat
│
└── views/                  # EJS Templates
    ├── index.ejs           # Landing Page
    ├── login.ejs           # Halaman Login Admin
    ├── dashboard.ejs       # Halaman Dashboard Admin (Protected)
    ├── produk.ejs          # Halaman Produk Publik
    ├── detail.ejs          # Halaman Detail Produk
    ├── tanya-ai.ejs        # Halaman Asisten AI Chat
    ├── 404.ejs             # Halaman Error 404 Custom
    └── partials/           # EJS Partial Components (Navbar, Footer, Header)
        ├── navbar.ejs
        └── footer.ejs

    🌐 Daftar Halaman & API Endpoints🖥️ Halaman Web (Views)HalamanURL PathAkses Public / ProtectedKeteranganBeranda/🌐 PublicLanding page utama tokoProduk/produk🌐 PublicKatalog produk (Fetch dinamis via API)Detail Produk/produk/:id🌐 PublicDetail informasi satu produkTanya AI/tanya-ai🌐 PublicChatbot interaktif pelangganLogin/login🌐 PublicForm login admin/kasirDashboard/dashboard🔒 Protected (Wajib Login)Management CRUD produk untuk admin🔌 REST API EndpointsHTTP MethodEndpoint PathAutentikasiFungsiPOST/api/login🌐 PublicMemproses login & membuat sessionPOST/api/logout🔒 ProtectedMenghapus session aktif (Logout)GET/api/products🌐 PublicMengambil seluruh data produk (JSON)GET/api/products/:id🌐 PublicMengambil detail produk by ID (JSON)POST/api/products🔒 ProtectedMenambah produk baru ke sistemPUT/api/products/:id🔒 ProtectedMemperbarui data, harga, & stok produkDELETE/api/products/:id🔒 ProtectedMenghapus produk dari sistemPOST/api/chat🌐 PublicMemproses pertanyaan & kirim balasan AI👤 Kredensial Akun AdminGunakan akun berikut untuk keperluan pengujian dan pemeriksaan oleh Asisten / Dosen:Username : adminPassword : admin123 (atau sesuaikan dengan password di .env/kodenya)Catatan: Kredensial ini digunakan untuk membuka akses halaman /dashboard dan menguji proteksi endpoint REST API.⚙️ Panduan Instalasi & Jalankan ServerPetunjuk untuk menjalankan aplikasi dari nol di lingkungan lokal:1. Clone RepositoryBashgit clone [LINK_REPOSITORY_GITHUB_ANDA]
2. Install Dependensi (npm)Bashnpm install
3. Konfigurasi Environment Variable (.env)Buat file baru bernama .env di direktori utama (root) project, lalu isi dengan variabel berikut:Cuplikan kodePORT=3000
SESSION_SECRET=berkah_ibu_aries_secret_key_2026
4. Jalankan AplikasiDevelopment Mode (Auto-reload via Nodemon):Bashnpm run dev
Production Mode / Standard Node:Bashnpm start
# atau
node app.js
5. Akses AplikasiBuka browser favorit Anda dan kunjungi:http://localhost:3000🧪 Panduan Pengujian (Testing Instructions)Pengujian Autentikasi & Protection:Akses http://localhost:3000/dashboard secara langsung di browser tanpa login. Sistem harus mengarahkan (redirect) Anda kembali ke /login.Lakukan request POST /api/products via Postman / Thunder Client tanpa cookie session. API harus merespon dengan status code 401 Unauthorized.Login melalui form di /login dengan kredensial admin yang benar. Setelah berhasil, Anda akan masuk ke halaman Dashboard.Pengujian CRUD Produk & Sinkronisasi Data:Di Dashboard Admin, tambahkan produk baru, atau ubah stok dan harga produk yang sudah ada.Buka halaman publik /produk di tab lain. Pastikan perubahan harga/stok yang baru saja diubah langsung muncul tanpa perlu merestart server Express.Pengujian Tanya AI:Buka halaman /tanya-ai.Ketik pertanyaan seperti "Toko buka jam berapa?", "Bisa bayar pakai apa?", atau "Berapa ongkirnya?".Pastikan balasan muncul secara dinamis di bubble chat sebagai respon JSON dari endpoint /api/chat.Pengujian Custom Logger:Perhatikan konsol / terminal saat Anda berpindah halaman atau mengirim request Fetch. Logger akan mencatat setiap request yang masuk (contoh: [09/08/2026 02:30:12] GET /api/products - 200).📊 Checklist Definition of Done (Sprint 2)[x] Halaman Login berfungsi (kredensial benar berhasil login, kredensial salah ditolak).[x] Dashboard terproteksi dan tidak dapat diakses tanpa login.[x] Fitur Logout menghapus session dan memblokir kembali akses dashboard.[x] REST API CRUD Produk (GET, POST, PUT, DELETE) berfungsi penuh.[x] Endpoint mutasi produk (POST, PUT, DELETE) menolak request tanpa login (401 Unauthorized).[x] Data produk pada Halaman Publik dipanggil dinamis via fetch('/api/products').[x] Sumber data produk antara Dashboard Admin dan Halaman Publik terpusat (Shared Data Source).[x] Fitur Tanya AI menggunakan POST /api/chat dengan pemrosesan logika backend (tanpa API AI eksternal).[x] Tampilan pesan Tanya AI dirender secara dinamis di DOM (Bubble Chat).[x] Minimal 1 Custom Middleware selain Auth aktif (Logger Middleware mencatat method, endpoint, dan waktu).[x] Validasi input dasar di frontend (JS) mencegah submit form kosong pada Login, Dashboard, dan Tanya AI.[x] File .env dan folder node_modules/ tidak di-push ke Git (tercantum di .gitignore).[x] Server dapat dijalankan dari nol hanya dengan npm install lalu npm run dev.[x] Repository berisi histori commit lengkap (≥3 Commit Sprint 1 + ≥3 Commit Sprint 2).