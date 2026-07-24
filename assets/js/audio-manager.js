/* =========================================================================
   AUDIO MANAGER
   -------------------------------------------------------------------------
   Menangani background music (fade in/out) dan sound effect pendek
   (pop, paper open, blow) dengan cara yang aman terhadap kebijakan
   autoplay browser (musik baru benar-benar mulai setelah user
   berinteraksi sekali dengan halaman).
   ========================================================================= */

const AudioManager = (() => {
  let bgmEl = null;
  let unlocked = false;

  function init() {
    bgmEl = document.getElementById("bgm");
    if (bgmEl) {
      bgmEl.src = SITE_CONFIG.audio.backgroundMusic;
      bgmEl.volume = 0;
    }

    // Browser modern memblokir audio dengan suara sebelum ada interaksi
    // pengguna. Kita dengarkan sekali saja interaksi pertama (tap/klik di
    // mana pun) sebagai sinyal untuk mulai memutar & fade-in musik latar.
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      playBackgroundMusic();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
  }

  function playBackgroundMusic() {
    if (!bgmEl) return;
    const targetVolume = SITE_CONFIG.audio.bgmVolume;
    const playPromise = bgmEl.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Akan otomatis tercoba lagi pada gesture berikutnya karena
        // `unlocked` baru di-set true setelah play() dipanggil di sini.
        unlocked = false;
      });
    }
    gsap.to(bgmEl, {
      volume: targetVolume,
      duration: SITE_CONFIG.audio.bgmFadeInDuration,
      ease: "power1.inOut",
    });
  }

  function fadeOutBackgroundMusic(duration = 3) {
    if (!bgmEl) return;
    gsap.to(bgmEl, {
      volume: 0,
      duration,
      ease: "power1.inOut",
      onComplete: () => bgmEl.pause(),
    });
  }

  // Sound effect pendek (pop, paper_open, blow). Membuat elemen Audio baru
  // setiap kali dipanggil supaya tap beruntun tidak saling memotong.
  function playSfx(key) {
    const src = SITE_CONFIG.audio[key];
    if (!src) return;
    const el = new Audio(src);
    el.volume = 1;
    el.play().catch(() => {
      /* diam-diam abaikan — sfx bukan hal kritis jika gagal diputar */
    });
  }

  return { init, playBackgroundMusic, fadeOutBackgroundMusic, playSfx };
})();
