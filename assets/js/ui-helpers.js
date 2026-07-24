/* =========================================================================
   UI HELPERS
   -------------------------------------------------------------------------
   Kumpulan helper kecil yang dipakai lebih dari satu page module.
   ========================================================================= */

// Unified hover (mouse) + press (mouse & touch) feedback lewat Pointer
// Events — satu implementasi untuk desktop & mobile, dibedakan lewat
// e.pointerType saat perlu. Dipakai oleh page1–page5.
function attachPressFeedback(el, { hoverScale = 1.03, pressScale = 0.96 } = {}) {
  el.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") {
      gsap.to(el, { scale: hoverScale, duration: 0.25, ease: "power2.out" });
    }
  });
  el.addEventListener("pointerleave", () => {
    gsap.to(el, { scale: 1, duration: 0.25, ease: "power2.out" });
  });
  el.addEventListener("pointerdown", () => {
    gsap.to(el, { scale: pressScale, duration: 0.15, ease: "power2.out" });
  });
  el.addEventListener("pointerup", (e) => {
    const back = e.pointerType === "mouse" ? hoverScale : 1;
    gsap.to(el, { scale: back, duration: 0.2, ease: "power2.out" });
  });
}
