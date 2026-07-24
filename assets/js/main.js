/* =========================================================================
   MAIN — titik masuk aplikasi
   -------------------------------------------------------------------------
   Saat page baru (page2.js, page3.js, dst) ditambahkan, cukup:
   1. Tambahkan <section id="pageX" class="page" hidden> di index.html
   2. Buat assets/js/pages/pageX.js yang expose PageX.init()
   3. Panggil PageX.init() di bawah, sebelum Router.goTo("page1")
   Tidak ada bagian lain yang perlu diubah.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  Router.init();
  AudioManager.init();

  Page1.init();
  Page2.init();
  Page3.init();
  Page4.init();
  Page5.init();

  Router.goTo("page1");
});
