// public/js/main.js
// Vanilla JS untuk toggle menu hamburger (mobile navbar)

document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!hamburgerBtn || !mobileMenu) return;

  hamburgerBtn.addEventListener("click", function () {
    const isHidden = mobileMenu.classList.contains("hidden");

    // Toggle class 'hidden' pada menu mobile
    mobileMenu.classList.toggle("hidden");

    // Update ikon hamburger <-> close (X)
    if (hamburgerIcon) {
      hamburgerIcon.classList.toggle("fa-bars", !isHidden);
      hamburgerIcon.classList.toggle("fa-xmark", isHidden);
    }

    // Update atribut aksesibilitas
    hamburgerBtn.setAttribute("aria-expanded", isHidden ? "true" : "false");
    hamburgerBtn.setAttribute(
      "aria-label",
      isHidden ? "Tutup menu navigasi" : "Buka menu navigasi"
    );
  });

  // Tutup menu mobile otomatis saat salah satu link diklik
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
      if (hamburgerIcon) {
        hamburgerIcon.classList.add("fa-bars");
        hamburgerIcon.classList.remove("fa-xmark");
      }
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.setAttribute("aria-label", "Buka menu navigasi");
    });
  });
});


/* ====================================================================
   FUNGSI TAMBAHAN (OPSIONAL)
   Gunakan fungsi ini HANYA jika Anda memuat data produk 
   menggunakan JavaScript (Fetch API / AJAX) di halaman katalog produk.
==================================================================== */

function createProductCardHTML(product) {
  // Fungsi pembantu untuk format Rupiah
  const formatRupiah = (number) => Number(number).toLocaleString('id-ID');

  // Mengecek apakah produk memiliki properti info dus
  const hasBoxInfo = product.boxPrice || product.itemsPerBox;
  
  // HTML untuk info dus (jika datanya ada)
  let boxInfoHTML = '';
  if (hasBoxInfo) {
    boxInfoHTML = `
      <div class="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1 text-xs">
        ${product.boxPrice ? `
          <div class="flex items-center gap-1.5 font-semibold text-slate-700">
            <span class="text-[11px] text-slate-400 font-normal">Dus:</span>
            <span class="text-blue-900 font-bold">Rp ${formatRupiah(product.boxPrice)}</span>
          </div>
        ` : ''}
        ${product.itemsPerBox ? `
          <div class="flex items-center gap-1.5 text-[11px] text-slate-500">
            <i class="fa-solid fa-box text-amber-500 text-[10px]"></i>
            <span>Isi: <strong class="text-slate-700">${product.itemsPerBox}</strong> pcs / dus</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Mengembalikan bentuk utuh elemen kartu produk
  return `
    <article class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1">
      <div>
        <div class="relative bg-slate-100 h-48 w-full overflow-hidden">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider border border-slate-100">
            ${product.category}
          </span>
        </div>
        
        <div class="p-5">
          <h3 class="font-bold text-slate-800 text-base mb-2 group-hover:text-blue-800 transition-colors line-clamp-2">
            ${product.name}
          </h3>
          
          <div class="flex items-baseline gap-1">
            <span class="text-xs text-slate-400 font-semibold">Rp</span>
            <span class="text-xl font-black text-red-600">${formatRupiah(product.price)}</span>
            <span class="text-[10px] text-slate-400 font-normal">/ pcs</span>
          </div>

          ${boxInfoHTML}
        </div>
      </div>

      <div class="p-5 pt-0">
        <a href="/produk/${product.id}" class="w-full bg-slate-900 text-white hover:bg-blue-800 text-center py-2.5 rounded-xl block font-bold text-sm transition-colors duration-200 shadow-sm">
          Lihat Detail
        </a>
      </div>
    </article>
  `;
}