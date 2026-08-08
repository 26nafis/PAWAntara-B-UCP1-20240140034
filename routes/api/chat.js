const express = require('express');
const router = express.Router();
const products = require('../../data/products.json');

// POST /api/chat
router.post('/', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ status: 'fail', message: 'Pesan tidak boleh kosong' });
  }

  const query = message.toLowerCase();
  let reply = '';

  if (query.includes('jam') || query.includes('buka') || query.includes('tutup')) {
    reply = 'Toko Berkah Ibu Aries buka setiap hari pukul 07.00 - 21.00 WIB.';
  } else if (query.includes('ongkir') || query.includes('kirim') || query.includes('pengiriman')) {
    reply = 'Gratis ongkos kirim untuk wilayah sekitar toko dengan minimal pembelian Rp 50.000!';
  } else if (query.includes('bayar') || query.includes('pembayaran')) {
    reply = 'Kami menerima pembayaran Tunai, Transfer Bank, dan QRIS.';
  } else if (query.includes('stok') || query.includes('produk') || query.includes('ada')) {
    const productList = products.map(p => `${p.name} (Stok: ${p.stock})`).join(', ');
    reply = `Produk yang tersedia saat ini: ${productList}.`;
  } else {
    reply = 'Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang jam buka, ongkir, pembayaran, atau stok produk.';
  }

  res.json({ status: 'success', reply });
});

module.exports = router;