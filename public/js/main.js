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
