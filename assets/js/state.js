/* =========================================================================
   APP STATE
   -------------------------------------------------------------------------
   State kecil yang perlu "diingat" lintas halaman selama SPA berjalan
   (tanpa localStorage/backend, sesuai brief — cukup bertahan selama tab
   ini terbuka). Saat ini isinya hasil dekorasi kue dari Page 3, yang
   nanti dibaca ulang oleh Page 4 supaya kue tampil identik di sana.
   ========================================================================= */

const AppState = (() => {
  // Setiap item: { id, kind: "sticker" | "letter", key, xPercent, yPercent, rotate }
  let cakeDecoration = [];

  function addDecoration(item) {
    cakeDecoration.push(item);
  }

  function removeDecorationById(id) {
    cakeDecoration = cakeDecoration.filter((d) => d.id !== id);
  }

  function getDecorations() {
    return cakeDecoration;
  }

  return { addDecoration, removeDecorationById, getDecorations };
})();
