document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.getElementById('product-list');

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();

      if (result.status === 'success') {
        renderProducts(result.data);
      } else {
        productContainer.innerHTML = '<p class="text-danger">Gagal memuat produk.</p>';
      }
    } catch (error) {
      console.error(error);
      productContainer.innerHTML = '<p class="text-danger">Terjadi kesalahan koneksi.</p>';
    }
  };

  const renderProducts = (products) => {
    productContainer.innerHTML = '';
    products.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <span class="badge bg-secondary mb-2">${p.category}</span>
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text text-primary fw-bold">Rp ${p.price.toLocaleString('id-ID')}</p>
            <p class="card-text"><small class="text-muted">Stok: ${p.stock}</small></p>
          </div>
        </div>
      `;
      productContainer.appendChild(col);
    });
  };

  fetchProducts();
});