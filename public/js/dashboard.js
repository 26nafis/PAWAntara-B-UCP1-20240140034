document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('productTableBody');
  const productForm = document.getElementById('productForm');
  const formTitle = document.getElementById('formTitle');
  const btnCancel = document.getElementById('btnCancel');
  const logoutBtn = document.getElementById('logoutBtn');

  // Helper untuk gambar fallback
  const getImageUrl = (url) => {
    if (!url || url.trim() === '') {
      return 'https://placehold.co/100x100/e2e8f0/475569?text=No+Image';
    }
    return url;
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();

      if (data.status === 'success') {
        tableBody.innerHTML = '';

        if (data.data.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="7" class="py-8 text-center text-slate-400">
                Belum ada data produk.
              </td>
            </tr>`;
          return;
        }

        data.data.forEach((p, idx) => {
          tableBody.innerHTML += `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="py-3.5 px-4 font-bold text-slate-400">${idx + 1}</td>
              <td class="py-3.5 px-4">
                <img 
                  src="${getImageUrl(p.image)}" 
                  alt="${p.name}" 
                  class="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-sm bg-slate-100"
                  referrerpolicy="no-referrer"
                  onerror="this.onerror=null; this.src='https://placehold.co/100x100/e2e8f0/475569?text=No+Image';"
                />
              </td>
              <td class="py-3.5 px-4 font-bold text-slate-900">${p.name}</td>
              <td class="py-3.5 px-4">
                <span class="bg-blue-50 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  ${p.category}
                </span>
              </td>
              <td class="py-3.5 px-4 font-bold text-red-600">
                Rp ${Number(p.price).toLocaleString('id-ID')}
              </td>
              <td class="py-3.5 px-4 font-bold">${p.stock}</td>
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button onclick="editProduct(${p.id})" class="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    Edit
                  </button>
                  <button onclick="deleteProduct(${p.id})" class="bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          `;
        });
      }
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    }
  };

  // Submit Handler (Tambah / Edit Produk)
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;

    // Buat objek FormData untuk pengiriman multipart/form-data
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('stock', document.getElementById('stock').value);

    // Ambil field Deskripsi Produk jika ada elemennya
    const descInput = document.getElementById('description');
    if (descInput) {
      formData.append('description', descInput.value);
    }

    // Ambil file berkas gambar
    const imageInput = document.getElementById('image');
    if (imageInput && imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
    }

    const url = id ? `/api/products/${id}` : '/api/products';
    const method = id ? 'PUT' : 'POST';

    try {
      // credentials: 'same-origin' memastikan cookie session terikut saat request
      const res = await fetch(url, {
        method,
        body: formData,
        credentials: 'same-origin'
      });

      if (res.ok) {
        resetForm();
        loadProducts();
      } else {
        const errResult = await res.json().catch(() => ({}));
        alert(errResult.message || 'Gagal menyimpan data produk');
      }
    } catch (error) {
      console.error('Error saat submit:', error);
      alert('Terjadi kesalahan sistem atau jaringan.');
    }
  });

  // Handler Edit Produk
  window.editProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const result = await res.json();
      if (result.status === 'success') {
        const p = result.data;
        document.getElementById('productId').value = p.id;
        document.getElementById('name').value = p.name;
        document.getElementById('category').value = p.category;
        document.getElementById('price').value = p.price;
        document.getElementById('stock').value = p.stock;

        // Populate field deskripsi
        const descInput = document.getElementById('description');
        if (descInput) {
          descInput.value = p.description || '';
        }

        formTitle.innerHTML = '<i class="fa-solid fa-pen-to-square text-amber-500 mr-1"></i> Edit Produk';
        btnCancel.classList.remove('hidden');
        btnCancel.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Gagal mengambil detail produk:', error);
    }
  };

  // Handler Hapus Produk
  window.deleteProduct = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { 
          method: 'DELETE',
          credentials: 'same-origin'
        });
        if (res.ok) {
          loadProducts();
        } else {
          const errResult = await res.json().catch(() => ({}));
          alert(errResult.message || 'Gagal menghapus produk');
        }
      } catch (error) {
        console.error('Error saat menghapus produk:', error);
      }
    }
  };

  btnCancel.addEventListener('click', resetForm);

  function resetForm() {
    productForm.reset();
    document.getElementById('productId').value = '';

    const descInput = document.getElementById('description');
    if (descInput) {
      descInput.value = '';
    }

    formTitle.innerHTML = '<i class="fa-solid fa-square-plus text-amber-500 mr-1"></i> Tambah Produk Baru';
    btnCancel.classList.add('hidden');
    btnCancel.classList.add('d-none');
  }

  // Handler Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'same-origin'
      });
      window.location.href = '/login';
    });
  }

  loadProducts();
});