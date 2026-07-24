/* =========================================================================
   PAGE 1 — BIRTHDAY INVITATION
   -------------------------------------------------------------------------
   Alur: amplop tertutup (idle floating) -> tap -> amplop terbuka + kartu
   undangan meluncur keluar 70% -> sticker muncul -> tombol Join / Not
   Today muncul.

   - Join   -> kartu & sticker masuk lagi, amplop menutup & mengecil,
               kamera zoom in, layar flash putih, lalu pindah ke Page 2.
   - Not Today -> kartu masuk lagi, amplop menutup, muncul teks
               "Maybe next time." + tombol "Open Again".
   ========================================================================= */

const Page1 = (() => {
  const cfg = SITE_CONFIG.page1;
  const assets = cfg.assets;

  // state machine: "closed" -> "opening" -> "open" -> "closing-join" | "closing-not-today" -> "maybe"
  let state = "closed";

  let idleTween = null;
  let settledIdleTween = null;

  // DOM refs (diisi saat init())
  let els = {};

  function init() {
    cacheDom();
    fillContent();
    setInitialTransforms();
    bindEvents();
    startIdleFloat();

    Router.register("page1", { onEnter: enterAnimation });
  }

  function cacheDom() {
    els.stage = document.getElementById("page1Stage");
    els.envelopeZone = document.getElementById("envelopeZone");
    els.envelopeShadow = document.getElementById("envelopeShadow");
    els.envelopeBtn = document.getElementById("envelopeBtn");
    els.envelopeImg = document.getElementById("envelopeImg");

    els.invitationCard = document.getElementById("invitationCard");
    els.stickerPhotoWrap = document.getElementById("stickerPhoto");
    els.stickerCake = document.getElementById("stickerCake");
    els.stickerBalloon = document.getElementById("stickerBalloon");

    els.invitationActions = document.getElementById("invitationActions");
    els.joinBtn = document.getElementById("joinBtn");
    els.notTodayBtn = document.getElementById("notTodayBtn");

    els.maybePanel = document.getElementById("maybePanel");
    els.openAgainBtn = document.getElementById("openAgainBtn");

    els.flashOverlay = document.getElementById("flashOverlay");
  }

  // Isi semua teks & src gambar dari SITE_CONFIG, supaya HTML tetap generic.
  function fillContent() {
    els.envelopeImg.src = assets.envelopeClosed;

    document.getElementById("invitationEyebrow").textContent = cfg.invitation.eyebrow;
    document.getElementById("invitationGreeting").textContent = cfg.invitation.greeting;
    document.getElementById("invitationClosing").textContent = cfg.invitation.closing;

    const bodyContainer = document.getElementById("invitationBody");
    bodyContainer.innerHTML = "";
    cfg.invitation.body.forEach((paragraph) => {
      const p = document.createElement("p");
      p.className = "invitation-card__body";
      p.innerHTML = paragraph;
      bodyContainer.appendChild(p);
    });

    els.joinBtn.textContent = cfg.buttons.join;
    els.notTodayBtn.textContent = cfg.buttons.notToday;
    els.openAgainBtn.textContent = cfg.buttons.openAgain;
    document.getElementById("maybeText").textContent = cfg.maybeText;
  }

  // Set posisi/skala awal lewat GSAP (bukan CSS) supaya GSAP memegang
  // penuh properti transform sejak frame pertama.
  function setInitialTransforms() {
    gsap.set(els.stage, { opacity: 0, scale: 0.96 });
    gsap.set(els.invitationCard, { xPercent: -50, yPercent: -38, scale: 0.8, opacity: 0 });
    gsap.set([els.stickerPhotoWrap, els.stickerCake, els.stickerBalloon], { opacity: 0 });
    gsap.set(els.invitationActions, { opacity: 0, y: 10 });
  }

  function bindEvents() {
    els.envelopeBtn.addEventListener("click", () => {
      if (state === "closed") openEnvelope();
    });

    els.joinBtn.addEventListener("click", joinCelebration);
    els.notTodayBtn.addEventListener("click", notToday);
    els.openAgainBtn.addEventListener("click", openAgain);

    attachPressFeedback(els.envelopeBtn, { hoverScale: 1.03, pressScale: 0.97 });
    attachPressFeedback(els.joinBtn, { hoverScale: 1.03, pressScale: 0.96 });
    attachPressFeedback(els.notTodayBtn, { hoverScale: 1.03, pressScale: 0.96 });
    attachPressFeedback(els.openAgainBtn, { hoverScale: 1.03, pressScale: 0.96 });
  }

  // (attachPressFeedback is now a shared helper — see assets/js/ui-helpers.js)

  // Halaman pertama kali muncul: fade + scale halus sebelum idle loop mulai.
  function enterAnimation() {
    gsap.to(els.stage, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" });
  }

  // ------------------------------------------------------------------
  // IDLE ANIMATIONS
  // ------------------------------------------------------------------
  function startIdleFloat() {
    idleTween = gsap.to(els.envelopeBtn, {
      y: -4,
      rotate: 1,
      duration: 5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Shadow "bernafas" berlawanan fase dengan naik-turunnya amplop.
    gsap.to(els.envelopeShadow, {
      scale: 0.88,
      opacity: 0.7,
      duration: 5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  // Setelah kartu keluar & settle, seluruh rangkaian (amplop+kartu+sticker)
  // diberi float sangat halus supaya scene tetap terasa hidup seperti
  // benda fisik di atas meja, bukan gambar statis.
  function startSettledIdle() {
    if (idleTween) idleTween.kill();
    gsap.set(els.envelopeBtn, { y: 0, rotate: 0 });
    settledIdleTween = gsap.to(els.envelopeZone, {
      y: -3,
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  function stopSettledIdle() {
    if (settledIdleTween) {
      settledIdleTween.kill();
      settledIdleTween = null;
      gsap.set(els.envelopeZone, { y: 0 });
    }
  }

  // ------------------------------------------------------------------
  // OPEN SEQUENCE
  // ------------------------------------------------------------------
  function openEnvelope() {
    if (state !== "closed") return;
    state = "opening";

    if (idleTween) idleTween.kill();
    gsap.set(els.envelopeBtn, { pointerEvents: "none", y: 0, rotate: 0 });

    AudioManager.playSfx("paperOpen");

    const tl = gsap.timeline({
      onComplete: () => {
        state = "open";
        startSettledIdle();
      },
    });

    tl.to(els.envelopeBtn, { scale: 0.97, duration: 0.12, ease: "power2.out" })
      .to(els.envelopeBtn, { scale: 1, duration: 0.18, ease: "power2.out" })
      .call(() => {
        els.envelopeImg.src = assets.envelopeOpen;
      }, null, 0.15)
      .to(
        els.invitationCard,
        {
          xPercent: -50,
          yPercent: -72,
          scale: 1,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
        },
        0.3
      )
      .set(els.invitationCard, { pointerEvents: "auto" }, 0.3)
      .fromTo(
        els.stickerPhotoWrap,
        { opacity: 0, scale: 0.6, rotate: -22 },
        { opacity: 1, scale: 1, rotate: -9, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.15"
      )
      .fromTo(
        els.stickerCake,
        { opacity: 0, scale: 0.6, rotate: 24 },
        { opacity: 1, scale: 1, rotate: 8, duration: 0.5, ease: "back.out(1.7)" },
        "<0.08"
      )
      .fromTo(
        els.stickerBalloon,
        { opacity: 0, scale: 0.6, rotate: 26 },
        { opacity: 1, scale: 1, rotate: 10, duration: 0.5, ease: "back.out(1.7)" },
        "<0.08"
      )
      .to(els.invitationActions, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
  }

  // ------------------------------------------------------------------
  // NOT TODAY -> "Maybe next time." panel
  // ------------------------------------------------------------------
  function notToday() {
    if (state !== "open") return;
    state = "closing-not-today";
    stopSettledIdle();

    AudioManager.playSfx("pop");

    const tl = gsap.timeline({
      onComplete: () => {
        state = "maybe";
        showMaybePanel();
      },
    });

    tl.to(els.invitationActions, { opacity: 0, y: 8, duration: 0.25, ease: "power2.out" })
      .to(
        [els.stickerPhotoWrap, els.stickerCake, els.stickerBalloon],
        { opacity: 0, scale: 0.6, duration: 0.25, ease: "power2.in" },
        "<"
      )
      .set(els.invitationCard, { pointerEvents: "none" })
      .to(
        els.invitationCard,
        { xPercent: -50, yPercent: -38, scale: 0.8, opacity: 0, duration: 0.5, ease: "power3.inOut" },
        "-=0.05"
      )
      .call(() => {
        els.envelopeImg.src = assets.envelopeClosed;
      }, null, "-=0.15");
  }

  function showMaybePanel() {
    els.invitationActions.style.display = "none";
    els.maybePanel.style.display = "flex";
    gsap.fromTo(els.maybePanel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  }

  function openAgain() {
    if (state !== "maybe") return;
    AudioManager.playSfx("pop");

    gsap.to(els.maybePanel, {
      opacity: 0,
      y: 8,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        els.maybePanel.style.display = "none";
        els.invitationActions.style.display = "flex";
        gsap.set(els.invitationActions, { opacity: 0, y: 8 });
        state = "closed";
        openEnvelope();
      },
    });
  }

  // ------------------------------------------------------------------
  // CONFETTI BURST — small, short-lived, no image assets needed. Used
  // once at the very start of the "Join" transition into Page 2.
  // ------------------------------------------------------------------
  function burstConfetti(originEl, count = 16) {
    const colors = ["#6E9C93", "#9C3532", "#BBCCD6", "#F0EED9", "#4F7A72"];
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height * 0.35;

    const pieces = [];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.style.position = "fixed";
      piece.style.left = originX + "px";
      piece.style.top = originY + "px";
      const size = 5 + Math.random() * 5;
      piece.style.width = size + "px";
      piece.style.height = size + "px";
      piece.style.background = colors[i % colors.length];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.zIndex = "400";
      piece.style.pointerEvents = "none";
      document.body.appendChild(piece);
      pieces.push(piece);
    }

    const tl = gsap.timeline({
      onComplete: () => pieces.forEach((p) => p.remove()),
    });

    pieces.forEach((piece) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 90;
      tl.to(
        piece,
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20,
          rotate: (Math.random() - 0.5) * 360,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0
      );
    });

    return tl;
  }

  // ------------------------------------------------------------------
  // JOIN -> long single transition into Page 2
  // ------------------------------------------------------------------
  function joinCelebration() {
    if (state !== "open") return;
    state = "closing-join";
    stopSettledIdle();

    AudioManager.playSfx("pop");
    burstConfetti(els.envelopeZone);

    const tl = gsap.timeline({
      delay: 0.1, // let the confetti register first, per brief
      onComplete: () => {
        Router.goTo("page2");
      },
    });

    tl.to(els.invitationActions, { opacity: 0, y: 8, duration: 0.25, ease: "power2.out" })
      .to(
        [els.stickerPhotoWrap, els.stickerCake, els.stickerBalloon],
        { opacity: 0, scale: 0.6, rotate: "+=6", duration: 0.3, ease: "power2.in" },
        "<"
      )
      .set(els.invitationCard, { pointerEvents: "none" })
      .to(
        els.invitationCard,
        { xPercent: -50, yPercent: -38, scale: 0.8, opacity: 0, duration: 0.5, ease: "power3.inOut" },
        "-=0.05"
      )
      .call(() => {
        els.envelopeImg.src = assets.envelopeClosed;
      }, null, "-=0.18")
      .to(els.envelopeZone, { scale: 0.9, duration: 0.3, ease: "power2.inOut" }, "-=0.05")
      .to(
        els.stage,
        { scale: 1.5, duration: 0.6, ease: "power2.inOut" },
        "-=0.1"
      )
      .to(els.flashOverlay, { opacity: 1, duration: 0.3, ease: "power1.in" }, "-=0.25");
  }

  return { init };
})();
