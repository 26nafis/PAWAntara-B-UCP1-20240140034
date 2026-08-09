const express = require('express');
const router = express.Router();
let products = require('../../data/products.json');

// POST /api/chat
router.post('/', (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
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
  } else if (query.includes('stok') || query.includes('produk') || query.includes('ada') || query.includes('jual')) {
    
    // Filter produk berdasarkan nama yang dicari pengguna (misal: "gula", "beras", "minyak")
    const matchedProducts = products.filter(p => {
      const productName = p.name.toLowerCase();
      // Mengecek apakah nama produk ada di dalam teks pertanyaan atau sebaliknya
      return query.includes(productName) || productName.split(' ').some(word => word.length > 2 && query.includes(word));
    });

    if (matchedProducts.length > 0) {
      // Jika ditemukan produk spesifik
      const resultList = matchedProducts
        .map(p => `${p.name} (Stok: ${p.stock}${p.price ? `, Harga: Rp ${p.price.toLocaleString('id-ID')}` : ''})`)
        .join(', ');
      reply = `Iya ada, berikut detail produk yang Anda cari: ${resultList}.`;
    } else if (query.includes('semua') || query.includes('daftar') || query.includes('katalog')) {
      // Jika pengguna meminta melihat SEMUA produk
      const productList = products.map(p => `${p.name} (Stok: ${p.stock})`).join(', ');
      reply = `Produk yang tersedia saat ini: ${productList}.`;
    } else {
      // Jika kata kunci produk tidak cocok dengan barang di toko
      reply = 'Maaf, produk yang Anda cari tidak ditemukan atau stok sedang kosong.';
    }

  } else {
    reply = 'Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang jam buka, ongkir, pembayaran, atau stok produk spesifik (contoh: "apakah ada gula?").';
  }

  res.json({ status: 'success', reply });
});

module.exports = router;