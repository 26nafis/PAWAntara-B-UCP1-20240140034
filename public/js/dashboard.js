document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('productTableBody');
  const productForm = document.getElementById('productForm');
  const formTitle = document.getElementById('formTitle');
  const btnCancel = document.getElementById('btnCancel');
  const logoutBtn = document.getElementById('logoutBtn');

  const loadProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.status === 'success') {
      tableBody.innerHTML = '';
      data.data.forEach((p, idx) => {
        tableBody.innerHTML += `
          <tr>
            <td>${idx + 1}</td>
            <td><img src="${p.image}" width="50" height="50" style="object-fit:cover;"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>Rp ${p.price.toLocaleString('id-ID')}</td>
            <td>${p.stock}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" onclick="editProduct(${p.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Hapus</button>
            </td>
          </tr>
        `;
      });
    }
  };

  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const payload = {
      name: document.getElementById('name').value,
      category: document.getElementById('category').value,
      price: document.getElementById('price').value,
      stock: document.getElementById('stock').value,
      image: document.getElementById('image').value
    };

    const url = id ? `/api/products/${id}` : '/api/products';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      resetForm();
      loadProducts();
    } else {
      alert('Gagal menyimpan data');
    }
  });

  window.editProduct = async (id) => {
    const res = await fetch(`/api/products/${id}`);
    const result = await res.json();
    if (result.status === 'success') {
      const p = result.data;
      document.getElementById('productId').value = p.id;
      document.getElementById('name').value = p.name;
      document.getElementById('category').value = p.category;
      document.getElementById('price').value = p.price;
      document.getElementById('stock').value = p.stock;
      document.getElementById('image').value = p.image;

      formTitle.textContent = 'Edit Produk';
      btnCancel.classList.remove('d-none');
    }
  };

  window.deleteProduct = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) loadProducts();
    }
  };

  btnCancel.addEventListener('click', resetForm);

  function resetForm() {
    productForm.reset();
    document.getElementById('productId').value = '';
    formTitle.textContent = 'Tambah Produk Baru';
    btnCancel.classList.add('d-none');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    });
  }

  loadProducts();
});