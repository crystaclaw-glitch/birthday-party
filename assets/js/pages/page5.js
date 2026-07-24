/* =========================================================================
   PAGE 5 — THANK YOU
   -------------------------------------------------------------------------
   Halaman penutup. Tidak ada tombol, tidak ada interaksi — brief secara
   eksplisit melarang next/back/replay/popup di sini. Hanya teks yang
   fade in dengan tenang, balon kecil yang mengambang pelan, dan musik
   latar yang fade out lalu berhenti.
   ========================================================================= */

const Page5 = (() => {
  const cfg = SITE_CONFIG.page5;
  const assets = cfg.assets;

  let els = {};
  let entered = false;

  function init() {
    cacheDom();
    fillStaticContent();
    buildDecorations();

    Router.register("page5", { onEnter: enterAnimation });
  }

  function cacheDom() {
    els.stage = document.getElementById("page5Stage");
    els.line1 = document.getElementById("thankyouLine1");
    els.line2 = document.getElementById("thankyouLine2");
    els.line3 = document.getElementById("thankyouLine3");
    els.extra = document.getElementById("thankyouExtra");
    els.heart = document.getElementById("thankyouHeart");
    els.decorationLayer = document.getElementById("page5DecorationLayer");
  }

  function fillStaticContent() {
    els.line1.textContent = cfg.lines[0];
    els.line2.textContent = cfg.lines[1];
    els.line3.textContent = cfg.lines[2];
    els.extra.textContent = cfg.extraLine;
    els.heart.textContent = cfg.heart;
  }

  function buildDecorations() {
    els.decorationLayer.innerHTML = "";
    cfg.decorations.forEach((deco) => {
      const img = document.createElement("img");
      img.src = assets.balloon;
      img.alt = "";
      img.style.top = deco.top;
      img.style.left = deco.left;
      img.dataset.rotate = deco.rotate;
      img.dataset.scale = deco.scale;
      els.decorationLayer.appendChild(img);
    });
  }

  function animateDecorationsIn() {
    const imgs = els.decorationLayer.querySelectorAll("img");
    imgs.forEach((img, i) => {
      const rotate = Number(img.dataset.rotate) || 0;
      const scale = Number(img.dataset.scale) || 1;
      gsap.fromTo(
        img,
        { opacity: 0, scale: scale * 0.7, rotate },
        { opacity: 1, scale, rotate, duration: 0.6, ease: "power2.out", delay: 0.15 * i }
      );

      // Floating sangat pelan, loop tanpa henti — dimulai setelah muncul.
      gsap.to(img, {
        y: "+=10",
        rotate: rotate + (i % 2 === 0 ? 3 : -3),
        duration: 5 + Math.random() * 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.6 + 0.15 * i,
      });
    });
  }

  // ------------------------------------------------------------------
  // ENTER ANIMATION — soft fade only, per brief (no bounce/typewriter)
  // ------------------------------------------------------------------
  function enterAnimation() {
    if (entered) return;
    entered = true;

    gsap.set(els.stage.querySelector(".thankyou-text"), { opacity: 0 });
    gsap.to(els.stage.querySelector(".thankyou-text"), {
      opacity: 1,
      duration: 1,
      ease: "power1.out",
      onComplete: animateDecorationsIn,
    });

    // Musik latar fade out 3 detik lalu berhenti, sesuai brief.
    AudioManager.fadeOutBackgroundMusic(3);
  }

  return { init };
})();
