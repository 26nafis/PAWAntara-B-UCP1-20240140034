// app.js
// Entry point server Express - Toko Berkah Ibu Aries (Sprint 2 Integrated)

require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");

// Import Middleware Custom
const loggerMiddleware = require("./middleware/logger");
const { requireAuthPage } = require("./middleware/auth");

// Import Routers REST API
const authApiRouter = require("./routes/api/auth");
const productsApiRouter = require("./routes/api/products");
const chatApiRouter = require("./routes/api/chat");

// Data produk lokal (digunakan untuk SSR EJS)
const products = require("./data/products.json");

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------
// View Engine & Static Assets
// ------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Parsing Body (Form & JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ------------------------------------------------------
// Middleware Session & Custom Logger
// ------------------------------------------------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "berkah_jaya_secret_key_2026",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // Session berlaku 1 jam
  })
);

// Panggil Logger Custom Middleware
app.use(loggerMiddleware);

// Middleware Global res.locals (SOLUSI ERROR "user is not defined")
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.siteName = "Toko Berkah Ibu Aries";
  next();
});

// Helper: cari produk berdasarkan id
function findProductById(id) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;
  return products.find((p) => p.id === numericId) || null;
}

// Helper: base locals untuk active-link navbar
function baseLocals(activePage) {
  return { activePage };
}

// ========================================================
// ROUTES - WEB VIEWS (EJS)
// ========================================================

// GET / -> Beranda
app.get("/", (req, res) => {
  const previewProducts = products.slice(0, 4);
  res.render("index", {
    ...baseLocals("home"),
    title: "Beranda",
    previewProducts,
  });
});

// GET /produk -> Daftar & Filter Produk
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

// GET /produk/:id -> Detail Produk
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

// GET /tanya-ai -> Halaman Chat AI
app.get("/tanya-ai", (req, res) => {
  res.render("tanya-ai", {
    ...baseLocals("tanya-ai"),
    title: "Tanya AI",
  });
});

// GET /login -> Halaman Login Admin
app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("login", {
    ...baseLocals("login"),
    title: "Login Admin",
  });
});

// GET /dashboard -> Halaman Admin (Dilindungi Auth Guard)
app.get("/dashboard", requireAuthPage, (req, res) => {
  res.render("dashboard", {
    ...baseLocals("dashboard"),
    title: "Dashboard Admin",
  });
});

// ========================================================
// ROUTES - REST API (Sprint 2)
// ========================================================
app.use("/api/auth", authApiRouter);
app.use("/api/products", productsApiRouter);
app.use("/api/chat", chatApiRouter);

// ========================================================
// 404 HANDLER
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