const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { requireAuthApi } = require('../../middleware/auth');

// Path ke file JSON database produk
const productsFilePath = path.join(__dirname, '../../data/products.json');

// ------------------------------------------------------
// Konfigurasi Multer untuk Upload Gambar
// ------------------------------------------------------
const uploadDir = path.join(__dirname, '../../public/uploads');

// Pastikan direktori public/uploads ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Helper Read & Write File JSON
const getProductsData = () => {
  if (!fs.existsSync(productsFilePath)) return [];
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const saveProductsData = (data) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// GET /api/products
router.get('/', (req, res) => {
  try {
    const products = getProductsData();
    res.json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengambil data produk' });
  }
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const products = getProductsData();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
    }
    res.json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengambil data produk' });
  }
});

// POST /api/products (Tambah Produk dengan Upload Gambar, Deskripsi & Proteksi Session)
router.post('/', requireAuthApi, upload.single('image'), (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;
    if (!name || !price || stock === undefined || !category) {
      return res.status(400).json({ status: 'fail', message: 'Data produk tidak lengkap' });
    }

    // Tentukan URL/path gambar
    let imagePath = 'https://placehold.co/300x300/e2e8f0/475569?text=No+Image';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image.trim() !== '') {
      imagePath = req.body.image;
    }

    const products = getProductsData();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      category,
      description: description || '',
      price: Number(price),
      stock: Number(stock),
      image: imagePath
    };

    products.push(newProduct);
    saveProductsData(products);

    res.status(201).json({ status: 'success', message: 'Produk berhasil ditambahkan', data: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menambah produk' });
  }
});

// PUT /api/products/:id (Update Produk dengan Upload Gambar Baru/Tetap, Deskripsi & Proteksi Session)
router.put('/:id', requireAuthApi, upload.single('image'), (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, price, stock, category, description } = req.body;
    const products = getProductsData();
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
    }

    // Tentukan path gambar: gunakan file upload baru > URL body > gambar lama
    let imagePath = products[index].image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image.trim() !== '') {
      imagePath = req.body.image;
    }

    products[index] = {
      ...products[index],
      name: name || products[index].name,
      category: category || products[index].category,
      description: description !== undefined ? description : (products[index].description || ''),
      price: price !== undefined ? Number(price) : products[index].price,
      stock: stock !== undefined ? Number(stock) : products[index].stock,
      image: imagePath
    };

    saveProductsData(products);
    res.json({ status: 'success', message: 'Produk berhasil diperbarui', data: products[index] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal mengupdate produk' });
  }
});

// DELETE /api/products/:id (Proteksi Session)
router.delete('/:id', requireAuthApi, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    let products = getProductsData();
    const exists = products.some(p => p.id === productId);

    if (!exists) {
      return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
    }

    products = products.filter(p => p.id !== productId);
    saveProductsData(products);

    res.json({ status: 'success', message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menghapus produk' });
  }
});

module.exports = router;
module.exports.getProductsData = getProductsData;