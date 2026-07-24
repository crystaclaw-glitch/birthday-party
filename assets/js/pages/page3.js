/* =========================================================================
   PAGE 3 — DECORATE YOUR CAKE
   -------------------------------------------------------------------------
   Drag & drop custom yang ringan, ditulis langsung dengan Pointer Events
   (bukan library) supaya satu kode yang sama jalan untuk mouse & touch.

   Alur pengambilan sticker/huruf:
   1. pointerdown di tray item -> buat "ghost" (klon visual) yang mengikuti
      pointer. Item ASLI di tray tidak pernah disentuh/dipindah.
   2. pointerup -> cek apakah posisi pointer ada di dalam area kue.
        - Di dalam  -> ghost dibuang, dekorasi permanen dirender di kue,
                        posisinya (dalam %) disimpan ke AppState.
        - Di luar   -> ghost dianimasikan kembali ke posisi tray lalu
                        dihapus.

   Posisi & ukuran dekorasi disimpan sebagai PERSENTASE terhadap area kue
   (bukan pixel), supaya saat Page 4 me-render ulang dengan ukuran kue
   yang mungkin sedikit berbeda, tata letaknya tetap identik proporsinya.
   ========================================================================= */

const Page3 = (() => {
  const cfg = SITE_CONFIG.page3;
  const assets = cfg.assets;
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  let els = {};
  let redoStack = [];
  let trayExpanded = true;
  let entered = false;
  let idCounter = 0;

  function init() {
    cacheDom();
    fillStaticContent();
    buildTrayStickers();
    buildTrayLetters();
    bindEvents();
    updateButtonStates();

    Router.register("page3", { onEnter: enterAnimation });
  }

  function cacheDom() {
    els.stage = document.getElementById("page3Stage");
    els.cakeZone = document.getElementById("cakeDropZone");
    els.cakeImg = document.getElementById("cakeImg");

    els.trayToggle = document.getElementById("trayToggle");
    els.trayPanel = document.getElementById("trayPanel");
    els.tabStickers = document.getElementById("tabStickers");
    els.tabLetters = document.getElementById("tabLetters");
    els.trayStickers = document.getElementById("trayStickers");
    els.trayLetters = document.getElementById("trayLetters");

    els.undoBtn = document.getElementById("undoBtn");
    els.redoBtn = document.getElementById("redoBtn");
    els.finishBtn = document.getElementById("finishBtn");

    els.confirmPopup = document.getElementById("confirmPopup");
    els.confirmCard = document.getElementById("confirmPopupCard");
    els.confirmPopupText = document.getElementById("confirmPopupText");
    els.popupBack = document.getElementById("popupBack");
    els.popupFinish = document.getElementById("popupFinish");

    els.dragGhostLayer = document.getElementById("dragGhostLayer");
    els.flashOverlay = document.getElementById("flashOverlay");
  }

  function fillStaticContent() {
    document.getElementById("page3Heading").textContent = cfg.heading;
    document.getElementById("page3Subtitle").textContent = cfg.subtitle;
    els.cakeImg.src = assets.cake;

    els.trayToggle.textContent = "▼ " + cfg.trayToggleLabel;
    els.tabStickers.textContent = cfg.tabs.stickers;
    els.tabLetters.textContent = cfg.tabs.letters;

    els.undoBtn.textContent = cfg.buttons.undo;
    els.redoBtn.textContent = cfg.buttons.redo;
    els.finishBtn.textContent = cfg.buttons.finish;

    els.confirmPopupText.textContent = cfg.popup.question;
    els.popupBack.textContent = cfg.popup.back;
    els.popupFinish.textContent = cfg.popup.finish;
  }

  // ------------------------------------------------------------------
  // TRAY BUILDING
  // ------------------------------------------------------------------
  function buildTrayStickers() {
    cfg.stickers.forEach((s) => {
      const item = document.createElement("div");
      item.className = "tray-item";
      item.dataset.kind = "sticker";
      item.dataset.key = s.id;
      item.innerHTML = STICKER_SVGS[s.id];
      item.setAttribute("role", "img");
      item.setAttribute("aria-label", s.label);
      els.trayStickers.appendChild(item);
      bindDraggable(item);
    });
  }

  function buildTrayLetters() {
    LETTERS.forEach((letter) => {
      const item = document.createElement("div");
      item.className = "tray-item";
      item.dataset.kind = "letter";
      item.dataset.key = letter;
      item.innerHTML = `<div class="letter-tile">${letter}</div>`;
      item.setAttribute("role", "img");
      item.setAttribute("aria-label", letter);
      els.trayLetters.appendChild(item);
      bindDraggable(item);
    });
  }

  // ------------------------------------------------------------------
  // DRAG & DROP
  // -------------------------------------------------------------------
  // Tray-nya bisa discroll horizontal (terutama tab Letters yang isinya
  // 26 item), jadi kita tidak boleh langsung "mengunci" gestur touch
  // sebagai drag sejak sentuhan pertama — itu akan memblokir scroll.
  // Sebagai gantinya: tunggu pointer bergerak melewati sedikit ambang
  // batas dulu, baru tentukan niatnya dari ARAH gerakan itu:
  //   - dominan vertikal -> user mengangkat item ke atas -> mulai DRAG
  //   - dominan horizontal -> user menggeser tray -> biarkan SCROLL asli
  // ------------------------------------------------------------------
  const DRAG_THRESHOLD = 8; // px

  function bindDraggable(item) {
    item.addEventListener("pointerdown", (downEvent) => armPointer(item, downEvent));
  }

  function armPointer(item, downEvent) {
    const kind = item.dataset.kind;
    const key = item.dataset.key;
    const startX = downEvent.clientX;
    const startY = downEvent.clientY;
    const half = 28; // half of the 56px tray item / ghost size

    let mode = null; // null (undecided) | "drag" | "scroll"
    let ghost = null;
    let setX = null;
    let setY = null;

    function beginDrag(e) {
      mode = "drag";
      item.setPointerCapture(downEvent.pointerId);

      ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      ghost.innerHTML = item.innerHTML;
      els.dragGhostLayer.appendChild(ghost);

      setX = gsap.quickSetter(ghost, "x", "px");
      setY = gsap.quickSetter(ghost, "y", "px");
      setX(e.clientX - half);
      setY(e.clientY - half);
      gsap.set(ghost, { scale: 1.1 });
    }

    function onMove(e) {
      if (mode === null) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;

        if (Math.abs(dy) > Math.abs(dx)) {
          beginDrag(e);
        } else {
          mode = "scroll";
          cleanup();
        }
        return;
      }
      if (mode === "drag") {
        e.preventDefault();
        setX(e.clientX - half);
        setY(e.clientY - half);
      }
    }

    function onUp(e) {
      cleanup();
      try { item.releasePointerCapture(e.pointerId); } catch (err) { /* no-op */ }
      if (mode !== "drag") return;

      const cakeRect = els.cakeZone.getBoundingClientRect();
      const inside =
        e.clientX >= cakeRect.left &&
        e.clientX <= cakeRect.right &&
        e.clientY >= cakeRect.top &&
        e.clientY <= cakeRect.bottom;

      if (inside) {
        const xPercent = ((e.clientX - cakeRect.left) / cakeRect.width) * 100;
        const yPercent = ((e.clientY - cakeRect.top) / cakeRect.height) * 100;
        ghost.remove();
        placeDecoration({ kind, key, xPercent, yPercent });
      } else {
        // Balik ke tray dengan animasi singkat, lalu hilang (brief: ~0.3s)
        const trayRect = item.getBoundingClientRect();
        gsap.to(ghost, {
          x: trayRect.left,
          y: trayRect.top,
          scale: 0.5,
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => ghost.remove(),
        });
      }
    }

    function onCancel(e) {
      cleanup();
      if (ghost) ghost.remove();
    }

    function cleanup() {
      item.removeEventListener("pointermove", onMove);
      item.removeEventListener("pointerup", onUp);
      item.removeEventListener("pointercancel", onCancel);
    }

    item.addEventListener("pointermove", onMove);
    item.addEventListener("pointerup", onUp);
    item.addEventListener("pointercancel", onCancel);
  }

  // ------------------------------------------------------------------
  // PLACE / RENDER / UNDO / REDO
  // ------------------------------------------------------------------
  function placeDecoration({ kind, key, xPercent, yPercent, id }) {
    const record = {
      id: id ?? `deco-${Date.now()}-${idCounter++}`,
      kind,
      key,
      xPercent,
      yPercent,
      // Brief: "Tidak perlu rotate" — dekorasi selalu ditempel lurus,
      // tidak diberi rotasi acak.
      rotate: 0,
    };
    AppState.addDecoration(record);
    redoStack = []; // aksi baru menghapus riwayat redo
    renderDecoration(record, { animateIn: true });
    updateButtonStates();
  }

  function renderDecoration(record, { animateIn = false } = {}) {
    const el = document.createElement("div");
    el.className = `cake-decoration cake-decoration--${record.kind}`;
    el.style.left = record.xPercent + "%";
    el.style.top = record.yPercent + "%";
    el.dataset.id = record.id;

    el.innerHTML =
      record.kind === "sticker" ? STICKER_SVGS[record.key] : `<div class="letter-tile">${record.key}</div>`;

    els.cakeZone.appendChild(el);

    if (animateIn) {
      gsap.set(el, { xPercent: -50, yPercent: -50, rotate: record.rotate, scale: 0.5, opacity: 0 });
      gsap.to(el, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" });
    } else {
      gsap.set(el, { xPercent: -50, yPercent: -50, rotate: record.rotate, scale: 1, opacity: 1 });
    }

    return el;
  }

  function undo() {
    const decos = AppState.getDecorations();
    if (decos.length === 0) return;
    const last = decos[decos.length - 1];
    AppState.removeDecorationById(last.id);
    redoStack.push(last);
    AudioManager.playSfx("pop");

    const el = els.cakeZone.querySelector(`[data-id="${last.id}"]`);
    if (el) {
      gsap.to(el, {
        y: "+=36",
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => el.remove(),
      });
    }
    updateButtonStates();
  }

  function redo() {
    if (redoStack.length === 0) return;
    const record = redoStack.pop();
    AppState.addDecoration(record);
    AudioManager.playSfx("pop");
    renderDecoration(record, { animateIn: true });
    updateButtonStates();
  }

  function updateButtonStates() {
    const hasAny = AppState.getDecorations().length > 0;
    els.finishBtn.disabled = !hasAny;
    els.undoBtn.disabled = !hasAny;
    els.redoBtn.disabled = redoStack.length === 0;
  }

  // ------------------------------------------------------------------
  // TRAY UI — collapse toggle + tab switching
  // ------------------------------------------------------------------
  function toggleTray() {
    trayExpanded = !trayExpanded;
    els.trayToggle.textContent = (trayExpanded ? "▼ " : "▲ ") + cfg.trayToggleLabel;

    if (trayExpanded) {
      gsap.set(els.trayPanel, { height: "auto" });
      const fullHeight = els.trayPanel.offsetHeight;
      gsap.fromTo(
        els.trayPanel,
        { height: 0, opacity: 0 },
        {
          height: fullHeight,
          opacity: 1,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => gsap.set(els.trayPanel, { height: "auto" }),
        }
      );
    } else {
      const fullHeight = els.trayPanel.offsetHeight;
      gsap.fromTo(
        els.trayPanel,
        { height: fullHeight, opacity: 1 },
        { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" }
      );
    }
  }

  function switchTab(tab) {
    const isStickers = tab === "stickers";
    els.tabStickers.classList.toggle("is-active", isStickers);
    els.tabLetters.classList.toggle("is-active", !isStickers);
    els.trayStickers.hidden = !isStickers;
    els.trayLetters.hidden = isStickers;
  }

  // ------------------------------------------------------------------
  // FINISH -> confirm popup -> Page 4
  // ------------------------------------------------------------------
  function openConfirmPopup() {
    if (els.finishBtn.disabled) return;
    AudioManager.playSfx("pop");
    els.confirmPopup.hidden = false;
    gsap.fromTo(els.confirmPopup, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
    gsap.fromTo(
      els.confirmCard,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
    );
  }

  function closeConfirmPopup() {
    AudioManager.playSfx("pop");
    gsap.to(els.confirmPopup, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        els.confirmPopup.hidden = true;
      },
    });
  }

  function confirmFinish() {
    AudioManager.playSfx("pop");

    const tl = gsap.timeline({
      onComplete: () => Router.goTo("page4"),
    });

    tl.to(els.confirmPopup, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        els.confirmPopup.hidden = true;
      },
    })
      .to(els.cakeZone, { scale: 1.05, duration: 0.35, ease: "power2.out" }, "-=0.05")
      .to(els.stage, { scale: 1.6, duration: 0.6, ease: "power2.inOut" }, "-=0.1")
      .to(els.flashOverlay, { opacity: 1, duration: 0.3, ease: "power1.in" }, "-=0.25");
  }

  // ------------------------------------------------------------------
  // EVENTS
  // ------------------------------------------------------------------
  function bindEvents() {
    els.trayToggle.addEventListener("click", toggleTray);
    els.tabStickers.addEventListener("click", () => switchTab("stickers"));
    els.tabLetters.addEventListener("click", () => switchTab("letters"));

    els.undoBtn.addEventListener("click", undo);
    els.redoBtn.addEventListener("click", redo);
    els.finishBtn.addEventListener("click", openConfirmPopup);
    els.popupBack.addEventListener("click", closeConfirmPopup);
    els.popupFinish.addEventListener("click", confirmFinish);

    [els.undoBtn, els.redoBtn, els.finishBtn, els.popupBack, els.popupFinish].forEach((btn) =>
      attachPressFeedback(btn, { hoverScale: 1.04, pressScale: 0.96 })
    );
  }

  // ------------------------------------------------------------------
  // ENTER ANIMATION
  // ------------------------------------------------------------------
  function enterAnimation() {
    gsap.set(els.stage, { scale: 1 }); // reset dari zoom Page 2 -> Page 3
    if (entered) return;
    entered = true;

    gsap.set(els.stage, { opacity: 0, y: 20, scale: 0.97 });
    gsap.to(els.stage, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" });
  }

  return { init };
})();
