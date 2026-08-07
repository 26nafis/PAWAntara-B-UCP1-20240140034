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
