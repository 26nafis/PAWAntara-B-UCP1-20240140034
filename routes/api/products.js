const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuthApi } = require('../../middleware/auth');

const productsFilePath = path.join(__dirname, '../../data/products.json');

const getProductsData = () => {
  if (!fs.existsSync(productsFilePath)) return [];
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
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

// POST /api/products (Proteksi Session)
router.post('/', requireAuthApi, (req, res) => {
  try {
    const { name, price, stock, category, image } = req.body;
    if (!name || !price || stock === undefined || !category) {
      return res.status(400).json({ status: 'fail', message: 'Data produk tidak lengkap' });
    }

    const products = getProductsData();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      price: Number(price),
      stock: Number(stock),
      category,
      image: image || 'https://via.placeholder.com/150'
    };

    products.push(newProduct);
    saveProductsData(products);

    res.status(201).json({ status: 'success', message: 'Produk berhasil ditambahkan', data: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Gagal menambah produk' });
  }
});

// PUT /api/products/:id (Proteksi Session)
router.put('/:id', requireAuthApi, (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, price, stock, category, image } = req.body;
    const products = getProductsData();
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
      return res.status(404).json({ status: 'fail', message: 'Produk tidak ditemukan' });
    }

    products[index] = {
      ...products[index],
      name: name || products[index].name,
      price: price !== undefined ? Number(price) : products[index].price,
      stock: stock !== undefined ? Number(stock) : products[index].stock,
      category: category || products[index].category,
      image: image || products[index].image
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