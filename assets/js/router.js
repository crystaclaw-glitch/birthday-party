/* =========================================================================
   ROUTER
   -------------------------------------------------------------------------
   Router SPA yang sangat ringan. Setiap page module (page1.js, page2.js,
   dst) mendaftarkan dirinya lewat Router.register(id, { onEnter }).
   Perpindahan antar page TIDAK melakukan reload — hanya menukar elemen
   mana yang terlihat, di bawah "flash" putih supaya perubahannya tidak
   pernah terlihat sebagai potongan kasar.

   Page yang sedang aktif (yang melakukan transisi KELUAR) bertanggung
   jawab menganimasikan flash overlay menjadi opaque sebagai bagian dari
   timeline GSAP miliknya sendiri. Router hanya bertanggung jawab
   memudarkan flash itu kembali SETELAH DOM ditukar, supaya setiap page
   baru otomatis "terungkap" dengan cara yang sama tanpa perlu menulis
   ulang logic ini di setiap page.
   ========================================================================= */

const Router = (() => {
  let current = null;
  const pages = {};
  let flashEl = null;

  function init() {
    flashEl = document.getElementById("flashOverlay");
  }

  function register(pageId, handlers) {
    pages[pageId] = handlers || {};
  }

  function goTo(pageId) {
    const nextSection = document.getElementById(pageId);
    if (!nextSection) {
      console.warn(`Router: halaman "${pageId}" belum ada di DOM.`);
      return;
    }

    if (current && current !== pageId) {
      const prevSection = document.getElementById(current);
      if (prevSection) {
        prevSection.hidden = true;
        prevSection.classList.remove("page--active");
      }
    }

    nextSection.hidden = false;
    nextSection.classList.add("page--active");
    current = pageId;

    // Bersihkan flash SETELAH DOM baru terpasang, supaya transisi baru
    // benar-benar terlihat "muncul dari balik cahaya putih".
    if (flashEl) {
      gsap.to(flashEl, { opacity: 0, duration: 0.45, ease: "power1.out", delay: 0.05 });
    }

    const handler = pages[pageId];
    if (handler && typeof handler.onEnter === "function") {
      handler.onEnter();
    } else {
      console.info(`Router: halaman "${pageId}" belum punya modul onEnter — menampilkan placeholder sementara.`);
    }
  }

  return {
    init,
    register,
    goTo,
    get current() {
      return current;
    },
  };
})();
