/* =========================================================================
   PAGE 4 — BIRTHDAY WISHES
   -------------------------------------------------------------------------
   - Kue ditampilkan ulang persis seperti hasil Page 3 (baca dari AppState,
     re-render dengan class .cake-decoration yang sama).
   - 4 note ucapan dari config, 1 note Custom Wish yang diisi user sendiri.
   - Blow the Candle baru muncul setelah Custom Wish terkirim, dan jadi
     satu-satunya pemicu perpindahan ke Page 5 (tanpa tombol "next").
   ========================================================================= */

const Page4 = (() => {
  const cfg = SITE_CONFIG.page4;
  const assets = cfg.assets;

  let els = {};
  let entered = false;
  let wishSent = false;

  function init() {
    cacheDom();
    fillStaticContent();
    renderWishesGrid();
    bindEvents();

    Router.register("page4", { onEnter: enterAnimation });
  }

  function cacheDom() {
    els.stage = document.getElementById("page4Stage");
    els.cakeZone = document.getElementById("page4CakeZone");
    els.cakeImg = document.getElementById("page4CakeImg");
    els.candle = document.getElementById("page4Candle");
    els.heading = document.getElementById("page4Heading");
    els.wishesGrid = document.getElementById("wishesGrid");
    els.blowBtn = document.getElementById("blowBtn");
    els.blowOverlay = document.getElementById("blowOverlay");
    els.flashOverlay = document.getElementById("flashOverlay");
  }

  function fillStaticContent() {
    els.heading.textContent = cfg.heading;
    els.cakeImg.src = SITE_CONFIG.page3.assets.cake;
    els.candle.src = assets.candleOn;
    els.blowBtn.textContent = cfg.blowButtonLabel;
  }

  // ------------------------------------------------------------------
  // CAKE ECHO — same decorations, same % positions, read from AppState
  // ------------------------------------------------------------------
  function renderCakeEcho() {
    AppState.getDecorations().forEach((record) => {
      const el = document.createElement("div");
      el.className = `cake-decoration cake-decoration--${record.kind}`;
      el.style.left = record.xPercent + "%";
      el.style.top = record.yPercent + "%";
      el.innerHTML =
        record.kind === "sticker" ? STICKER_SVGS[record.key] : `<div class="letter-tile">${record.key}</div>`;
      gsap.set(el, { xPercent: -50, yPercent: -50, rotate: record.rotate || 0, scale: 1, opacity: 1 });
      els.cakeZone.appendChild(el);
    });
  }

  // ------------------------------------------------------------------
  // WISHES GRID — 4 fixed wishes + 1 editable custom wish
  // ------------------------------------------------------------------
  function renderWishesGrid() {
    els.wishesGrid.innerHTML = "";

    cfg.wishes.forEach((wish, i) => {
      const card = document.createElement("div");
      card.className = "wish-card";
      card.innerHTML = `
        <img src="${assets.notes[i]}" alt="" />
        <div class="wish-card__content">
          <p class="wish-card__message">${wish.message}</p>
        </div>
      `;
      els.wishesGrid.appendChild(card);
    });

    // Custom wish card — starts as a form, becomes read-only after Send.
    const customCard = document.createElement("div");
    customCard.className = "wish-card wish-card--custom";
    customCard.innerHTML = `
      <img src="${assets.notes[4]}" alt="" />
      <form class="custom-wish-form" id="customWishForm">
        <input type="text" id="customWishName" placeholder="${cfg.customWish.namePlaceholder}" maxlength="40" />
        <textarea id="customWishText" placeholder="${cfg.customWish.wishPlaceholder}" maxlength="220"></textarea>
        <p class="custom-wish-error" id="customWishError"></p>
        <button type="submit" class="paper-btn paper-btn--primary custom-wish-send" id="customWishSend">
          ${cfg.customWish.sendLabel}
        </button>
      </form>
      <div class="wish-result" id="wishResult">
        <p class="wish-result__name" id="wishResultName"></p>
        <p class="wish-result__message" id="wishResultMessage"></p>
      </div>
    `;
    els.wishesGrid.appendChild(customCard);

    els.customForm = document.getElementById("customWishForm");
    els.customName = document.getElementById("customWishName");
    els.customText = document.getElementById("customWishText");
    els.customError = document.getElementById("customWishError");
    els.wishResult = document.getElementById("wishResult");
    els.wishResultName = document.getElementById("wishResultName");
    els.wishResultMessage = document.getElementById("wishResultMessage");

    els.customForm.addEventListener("submit", handleWishSubmit);
  }

  function handleWishSubmit(e) {
    e.preventDefault();
    const name = els.customName.value.trim();
    const wish = els.customText.value.trim();

    if (!name) {
      showCustomError(cfg.customWish.nameMissing);
      return;
    }
    if (!wish) {
      showCustomError(cfg.customWish.wishMissing);
      return;
    }

    AudioManager.playSfx("pop");
    els.customError.classList.remove("is-visible");

    gsap.to(els.customForm, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        els.customForm.style.display = "none";
        els.wishResultName.textContent = name;
        els.wishResultMessage.textContent = wish;
        els.wishResult.classList.add("is-visible");
        gsap.fromTo(els.wishResult, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        revealBlowButton();
      },
    });
  }

  function showCustomError(message) {
    els.customError.textContent = message;
    els.customError.classList.add("is-visible");
  }

  function revealBlowButton() {
    wishSent = true;
    gsap.to(els.blowBtn, { opacity: 1, duration: 0.4, ease: "power2.out" });
  }

  // ------------------------------------------------------------------
  // BLOW THE CANDLE — smoke, then a long transition into Page 5
  // ------------------------------------------------------------------
  function bindEvents() {
    els.blowBtn.addEventListener("click", handleBlow);
    attachPressFeedback(els.blowBtn, { hoverScale: 1.05, pressScale: 0.95 });
  }

  // Membuat beberapa "puff" asap (murni CSS/GSAP, tanpa gambar) naik dari
  // satu titik lalu memudar. Dipakai dua kali: efek lokal kecil saat lilin
  // ditiup, dan efek besar yang memenuhi layar saat pindah ke Page 5.
  function spawnSmoke(originX, originY, count, opts) {
    const puffs = [];
    for (let i = 0; i < count; i++) {
      const size = opts.size + Math.random() * opts.sizeVariance;
      const puff = document.createElement("div");
      puff.className = "smoke-puff";
      puff.style.width = size + "px";
      puff.style.height = size + "px";
      puff.style.left = originX - size / 2 + "px";
      puff.style.top = originY - size / 2 + "px";
      document.body.appendChild(puff);
      puffs.push(puff);
    }

    const tl = gsap.timeline({ onComplete: () => puffs.forEach((p) => p.remove()) });
    puffs.forEach((puff, i) => {
      const dx = (Math.random() - 0.5) * opts.spread;
      const dy = -(opts.rise + Math.random() * opts.riseVariance);
      tl.to(
        puff,
        {
          x: dx,
          y: dy,
          scale: opts.endScale,
          opacity: 0,
          duration: opts.duration,
          ease: "power1.out",
        },
        i * 0.05
      );
    });
    return tl;
  }

  function candleOrigin() {
    const rect = els.candle.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.15 };
  }

  function handleBlow() {
    if (!wishSent) return;
    els.blowBtn.disabled = true;

    AudioManager.playSfx("blow");
    els.candle.src = assets.candleOff;

    const origin = candleOrigin();

    const tl = gsap.timeline({ onComplete: goToPage5 });
    tl.add(spawnSmoke(origin.x, origin.y, 5, {
      size: 22, sizeVariance: 14, spread: 60, rise: 70, riseVariance: 30, endScale: 1.8, duration: 1,
    }), 0)
      .to(els.blowOverlay, { opacity: 0.25, duration: 0.4, ease: "power1.out" }, 0)
      .to(els.blowOverlay, { opacity: 0, duration: 0.5, ease: "power1.in" }, 0.5);
  }

  // Setelah asap lokal reda, lanjut ke transisi besar menuju Page 5 —
  // asap yang lebih banyak & besar, layar mengabur, lalu fade putih
  // (memakai flash-overlay yang sama seperti transisi antar halaman lain).
  function goToPage5() {
    const origin = candleOrigin();

    const tl = gsap.timeline({ onComplete: () => Router.goTo("page5") });
    tl.add(spawnSmoke(origin.x, origin.y, 10, {
      size: 55, sizeVariance: 45, spread: 240, rise: 170, riseVariance: 90, endScale: 2.6, duration: 1.15,
    }), 0)
      .fromTo(els.stage, { filter: "blur(0px)" }, { filter: "blur(6px)", scale: 0.94, duration: 1, ease: "power1.out" }, 0)
      .to(els.flashOverlay, { opacity: 1, duration: 0.7, ease: "power1.in" }, 0.25);
  }

  // ------------------------------------------------------------------
  // ENTER ANIMATION
  // ------------------------------------------------------------------
  function enterAnimation() {
    gsap.set(els.stage, { filter: "blur(0px)", scale: 1 }); // reset dari transisi Page 3 -> 4
    if (entered) return;
    entered = true;
    renderCakeEcho();
    gsap.set(els.stage, { opacity: 0, y: 16 });
    gsap.to(els.stage, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
  }

  return { init };
})();
