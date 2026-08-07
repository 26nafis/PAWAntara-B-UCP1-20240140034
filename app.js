// app.js
// Entry point server Express - Toko Berkah (Sprint 1)

const express = require("express");
const path = require("path");
const products = require("./data/products");

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------
// View engine setup (EJS)
// ------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------------------------------------------
// Static assets (CSS/JS/gambar) lewat express.static
// ------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// Middleware bawaan untuk parsing form (dipakai form Tanya AI walau belum ada logic balasan)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ------------------------------------------------------
// Helper: cari produk berdasarkan id
// ------------------------------------------------------
function findProductById(id) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;
  return products.find((p) => p.id === numericId) || null;
}

// Data yang dipakai untuk navbar (biar active-link konsisten di semua halaman)
function baseLocals(activePage) {
  return { activePage, siteName: "Toko Berkah Ibu Aries" };
}

// ========================================================
// ROUTES - HALAMAN (Server-side render EJS)
// ========================================================

// GET / -> Beranda: hero section + preview beberapa produk
app.get("/", (req, res) => {
  const previewProducts = products.slice(0, 4); // ambil 4 produk pertama sebagai preview
  res.render("index", {
    ...baseLocals("home"),
    title: "Beranda",
    previewProducts,
  });
});

// GET /produk -> Daftar semua produk + filter lewat query string (?kategori=&search=)
app.get("/produk", (req, res) => {
  const { kategori, search } = req.query;
  let filteredProducts = [...products];

  if (kategori && kategori.trim() !== "") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }

  if (search && search.trim() !== "") {
    const keyword = search.toLowerCase().trim();
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );
  }

  // Daftar kategori unik untuk dropdown filter
  const categories = [...new Set(products.map((p) => p.category))];

  res.render("produk", {
    ...baseLocals("produk"),
    title: "Produk",
    allProducts: filteredProducts,
    categories,
    selectedCategory: kategori || "",
    searchQuery: search || "",
    totalFound: filteredProducts.length,
  });
});

// GET /produk/:id -> Detail 1 produk (route dinamis)
app.get("/produk/:id", (req, res) => {
  const product = findProductById(req.params.id);

  if (!product) {
    return res.status(404).render("detail", {
      ...baseLocals("produk"),
      title: "Produk Tidak Ditemukan",
      product: null,
    });
  }

  res.render("detail", {
    ...baseLocals("produk"),
    title: product.name,
    product,
  });
});

// GET /tanya-ai -> Tampilan chat + form (belum ada logic balasan)
app.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", {
    ...baseLocals("tanya-ai"),
    title: "Tanya AI",
  });
});

// ========================================================
// ROUTES - REST API (Read-only, fondasi Sprint 2)
// ========================================================

// GET /api/products -> mengembalikan seluruh data produk dummy dalam format JSON
app.get("/api/products", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Berhasil mengambil seluruh data produk",
    total: products.length,
    data: products,
  });
});

// ========================================================
// 404 HANDLER - untuk route/halaman yang tidak ada sama sekali
// ========================================================
app.use((req, res) => {
  res.status(404).render("404", {
    ...baseLocals(""),
    title: "Halaman Tidak Ditemukan",
  });
});

// ========================================================
// START SERVER
// ========================================================
app.listen(PORT, () => {
  console.log(`Server Toko Berkah berjalan di http://localhost:${PORT}`);
});
