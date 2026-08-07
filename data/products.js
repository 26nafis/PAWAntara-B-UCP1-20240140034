// data/products.js
// Data dummy produk sembako. Sprint 2 nanti akan diganti dengan database sungguhan.

const products = [
  {
    id: 1,
    name: "Beras Premium 5kg",
    category: "sembako",
    price: 68000,
    stock: 42,
    image: "https://placehold.co/400x300/16a34a/ffffff?text=Beras+5kg",
    description:
      "Beras putih premium pulen, cocok untuk kebutuhan harian keluarga. Dikemas dalam karung 5kg berkualitas.",
  },
  {
    id: 2,
    name: "Minyak Goreng 2L",
    category: "sembako",
    price: 34500,
    stock: 30,
    image: "https://placehold.co/400x300/f59e0b/ffffff?text=Minyak+2L",
    description:
      "Minyak goreng kemasan botol 2 liter, jernih dan rendah kolesterol, cocok untuk segala jenis masakan.",
  },
  {
    id: 3,
    name: "Gula Pasir 1kg",
    category: "sembako",
    price: 15500,
    stock: 55,
    image: "https://placehold.co/400x300/e11d48/ffffff?text=Gula+1kg",
    description:
      "Gula pasir putih bersih, butiran halus, cocok untuk kebutuhan memasak dan minuman sehari-hari.",
  },
  {
    id: 4,
    name: "Telur Ayam 1kg",
    category: "protein",
    price: 28000,
    stock: 20,
    image: "https://placehold.co/400x300/eab308/ffffff?text=Telur+1kg",
    description:
      "Telur ayam segar pilihan, sumber protein tinggi, langsung dari peternak lokal terpercaya.",
  },
  {
    id: 5,
    name: "Tepung Terigu 1kg",
    category: "sembako",
    price: 13000,
    stock: 38,
    image: "https://placehold.co/400x300/a3a3a3/ffffff?text=Tepung+1kg",
    description:
      "Tepung terigu serbaguna untuk membuat kue, gorengan, maupun keperluan dapur lainnya.",
  },
  {
    id: 6,
    name: "Kecap Manis 600ml",
    category: "bumbu",
    price: 22000,
    stock: 25,
    image: "https://placehold.co/400x300/78350f/ffffff?text=Kecap+600ml",
    description:
      "Kecap manis kental dengan rasa gurih dan manis seimbang, cocok untuk berbagai masakan nusantara.",
  },
  {
    id: 7,
    name: "Garam Dapur 500g",
    category: "bumbu",
    price: 5000,
    stock: 60,
    image: "https://placehold.co/400x300/64748b/ffffff?text=Garam+500g",
    description:
      "Garam beryodium halus untuk kebutuhan memasak sehari-hari, dikemas praktis dalam kantong 500 gram.",
  },
  {
    id: 8,
    name: "Kopi Bubuk 200g",
    category: "minuman",
    price: 18500,
    stock: 33,
    image: "https://placehold.co/400x300/451a03/ffffff?text=Kopi+200g",
    description:
      "Kopi bubuk asli robusta, aroma kuat dan nikmat, cocok diseduh untuk memulai hari.",
  },
];

module.exports = products;
