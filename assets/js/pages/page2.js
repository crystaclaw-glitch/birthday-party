/* =========================================================================
   PAGE 2 — SAVE THE DATE
   -------------------------------------------------------------------------
   Kalender dibangun murni dari satu variabel: SITE_CONFIG.birthdayDate.
   Ganti tanggal/bulan/tahun di config.js dan seluruh grid (jumlah hari,
   offset hari pertama, highlight) akan otomatis menyesuaikan.
   ========================================================================= */

const Page2 = (() => {
  const cfg = SITE_CONFIG.page2;
  const assets = cfg.assets;

  let els = {};
  let entered = false; // supaya animasi masuk hanya jalan sekali

  function init() {
    cacheDom();
    fillStaticContent();
    buildCalendar();
    buildDecorations();
    bindEvents();

    Router.register("page2", { onEnter: enterAnimation });
  }

  function cacheDom() {
    els.stage = document.getElementById("page2Stage");
    els.name = document.getElementById("page2Name");
    els.spiral = document.getElementById("calendarSpiral");
    els.month = document.getElementById("calendarMonth");
    els.grid = document.getElementById("calendarGrid");
    els.decorationLayer = document.getElementById("decorationLayer");
    els.cakeCta = document.getElementById("cakeCta");
    els.cakeCtaImg = document.getElementById("cakeCtaImg");
    els.cakeCtaLabel = document.getElementById("cakeCtaLabel");
    els.flashOverlay = document.getElementById("flashOverlay");
  }

  function fillStaticContent() {
    document.getElementById("page2Eyebrow").textContent = cfg.eyebrow;
    els.name.textContent = SITE_CONFIG.recipientName + cfg.nameSuffix;
    els.cakeCtaImg.src = assets.cakeSticker;
    els.cakeCtaLabel.textContent = cfg.cakeCtaLabel;

    // Spiral notebook rings — jumlah menyesuaikan lebar via CSS flex,
    // cukup render sejumlah tetap yang terlihat baik di semua lebar kartu.
    els.spiral.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const ring = document.createElement("span");
      els.spiral.appendChild(ring);
    }
  }

  // ------------------------------------------------------------------
  // CALENDAR — generated purely from SITE_CONFIG.birthdayDate
  // ------------------------------------------------------------------
  function buildCalendar() {
    const bday = SITE_CONFIG.birthdayDate;
    const year = bday.getFullYear();
    const month = bday.getMonth();
    const birthDate = bday.getDate();

    els.month.textContent = `${cfg.monthNames[month]} ${year}`;

    els.grid.innerHTML = "";

    // Day-of-week headers (Sun..Sat)
    cfg.dayNames.forEach((day) => {
      const label = document.createElement("div");
      label.className = "calendar-day-name";
      label.textContent = day.slice(0, 3);
      els.grid.appendChild(label);
    });

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Leading empty cells so day 1 lands in the correct weekday column
    for (let i = 0; i < firstDayOfMonth; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-cell calendar-cell--empty";
      els.grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      if (d === birthDate) cell.classList.add("is-birthday");

      const highlight = document.createElement("span");
      highlight.className = "calendar-cell__highlight";
      cell.appendChild(highlight);

      const num = document.createElement("span");
      num.className = "calendar-cell__num";
      num.textContent = String(d);
      cell.appendChild(num);

      els.grid.appendChild(cell);
    }
  }

  let highlightTween = null;

  function pulseBirthdayHighlight() {
    const highlight = els.grid.querySelector(".is-birthday .calendar-cell__highlight");
    if (!highlight) return;
    if (highlightTween) highlightTween.kill();
    highlightTween = gsap.to(highlight, {
      scale: 1.18,
      opacity: 0.28,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  // ------------------------------------------------------------------
  // DECORATIONS — fully driven by SITE_CONFIG.page2.decorations
  // ------------------------------------------------------------------
  function buildDecorations() {
    els.decorationLayer.innerHTML = "";
    cfg.decorations.forEach((deco, i) => {
      const img = document.createElement("img");
      img.src = assets[deco.asset];
      img.alt = "";
      img.style.top = deco.top;
      img.style.left = deco.left;
      img.dataset.rotate = deco.rotate;
      img.dataset.scale = deco.scale;
      img.dataset.index = i;
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
        { opacity: 0, scale: scale * 0.6, rotate: rotate - 15 },
        {
          opacity: 1,
          scale,
          rotate,
          duration: 0.55,
          ease: "back.out(1.6)",
          delay: 0.05 * i,
        }
      );
    });
  }

  // ------------------------------------------------------------------
  // EVENTS
  // ------------------------------------------------------------------
  function bindEvents() {
    els.cakeCta.addEventListener("click", goToPage3);
    attachPressFeedback(els.cakeCta, { hoverScale: 1.05, pressScale: 0.95 });
  }

  // (shared helper — see assets/js/ui-helpers.js)

  function goToPage3() {
    AudioManager.playSfx("pop");

    const tl = gsap.timeline({
      onComplete: () => {
        Router.goTo("page3");
      },
    });

    tl.to(els.cakeCta, { scale: 1.08, duration: 0.2, ease: "power2.out" })
      .to(els.stage, { scale: 2.2, duration: 0.6, ease: "power2.inOut", transformOrigin: "50% 88%" }, "-=0.05")
      .to(els.flashOverlay, { opacity: 1, duration: 0.3, ease: "power1.in" }, "-=0.25");
  }

  // ------------------------------------------------------------------
  // ENTER ANIMATION (fade / slide up / slight scale, per brief)
  // ------------------------------------------------------------------
  function enterAnimation() {
    gsap.set(els.stage, { scale: 1 }); // reset from any previous zoom-out transform
    if (entered) {
      pulseBirthdayHighlight();
      animateDecorationsIn();
      return;
    }
    entered = true;

    gsap.set(els.stage, { opacity: 0, y: 24, scale: 0.97 });
    gsap.to(els.stage, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => {
        pulseBirthdayHighlight();
        animateDecorationsIn();
      },
    });
  }

  return { init };
})();
