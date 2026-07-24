/* =========================================================================
   SITE CONFIG
   -------------------------------------------------------------------------
   Semua hal yang mungkin ingin kamu ubah (nama, tanggal, isi teks, path
   asset, audio) diletakkan di sini. File-file JS lain hanya MEMBACA
   objek ini, jadi kamu tidak perlu menyentuh logic di manapun untuk
   mengganti konten.
   ========================================================================= */

const SITE_CONFIG = {

  // Nama yang berulang tahun. Dipakai di beberapa halaman.
  recipientName: "Mahen",

  // Tanggal ulang tahun. Bulan dimulai dari 0 (0 = Januari), jadi
  // 30 Mei 2026 ditulis (2026, 4, 30). Dipakai nanti di Page 2 (kalender).
  birthdayDate: new Date(2026, 4, 30),

  // ---------------------------------------------------------------------
  // AUDIO
  // ---------------------------------------------------------------------
  audio: {
    backgroundMusic: "assets/audio/background_music.mp3",
    paperOpen: "assets/audio/paper_open.m4a",
    pop: "assets/audio/pop.m4a",
    blow: "assets/audio/blow.m4a",
    // Volume musik latar (0 - 1)
    bgmVolume: 0.55,
    // Berapa lama fade-in musik latar saat pertama diputar (detik)
    bgmFadeInDuration: 2,
  },

  // ---------------------------------------------------------------------
  // PAGE 1 — BIRTHDAY INVITATION
  // ---------------------------------------------------------------------
  page1: {
    assets: {
      background: "assets/images/page1/background_light.jpg",
      envelopeClosed: "assets/images/page1/envelope_closed.webp",
      envelopeOpen: "assets/images/page1/envelope_open.webp",
      invitationCard: "assets/images/page1/invitation_card.webp",
      stickerCake: "assets/images/page1/sticker_cake.webp",
      stickerBalloon: "assets/images/page1/sticker_balloon.webp",
      stickerPhoto: "assets/images/page1/sticker_photo.webp",
    },

    // Isi undangan. Ganti teks di sini kapan saja.
    invitation: {
      eyebrow: "You're Invited",
      greeting: "Dear,",
      // Setiap item pada array body akan menjadi satu paragraf terpisah.
      body: [
        "You are warmly invited to celebrate <strong>Mahen's birthday.</strong>",
        "A day filled with laughter, candle-blowing, heartfelt wishes, and cake decorating awaits.",
      ],
      closing: "Will you come?",
    },

    buttons: {
      join: "Join",
      notToday: "Not Today",
      openAgain: "Open Again",
    },

    maybeText: "Maybe next time.",
  },

  // ---------------------------------------------------------------------
  // PAGE 2 — SAVE THE DATE
  // ---------------------------------------------------------------------
  page2: {
    assets: {
      background: "assets/images/page2/background_table.jpg",
      paperGrain: "assets/images/shared/paper_grain.jpg",
      stickerBalloon: "assets/images/page2/sticker_balloon.webp",
      stickerPhoto: "assets/images/page2/sticker_photo.webp",
      stickerStar: "assets/images/page2/sticker_star.webp",
      stickerConfetti: "assets/images/page2/sticker_confetti.webp",
      stickerLove: "assets/images/page2/sticker_love.webp",
      cakeSticker: "assets/images/page2/cake_sticker.webp",
    },

    eyebrow: "Save The Date",
    nameSuffix: "'s Birthday!", // dirangkai jadi "Mahen's Birthday!"

    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],

    // Dekorasi bebas ditambah/dikurangi/diubah posisinya di sini.
    // top/left dalam persen relatif ke seluruh area halaman.
    // rotate dalam derajat, scale adalah pengali ukuran.
    decorations: [
      { asset: "stickerBalloon", top: "10%", left: "6%", rotate: -8, scale: 1 },
      { asset: "stickerPhoto", top: "8%", left: "70%", rotate: 6, scale: 1 },
      { asset: "stickerStar", top: "66%", left: "4%", rotate: -10, scale: 0.85 },
      { asset: "stickerConfetti", top: "2%", left: "34%", rotate: 3, scale: 1 },
      { asset: "stickerLove", top: "62%", left: "80%", rotate: 9, scale: 0.8 },
    ],

    cakeCtaLabel: "Click Me!",
  },

  // ---------------------------------------------------------------------
  // PAGE 3 — DECORATE YOUR CAKE
  // ---------------------------------------------------------------------
  page3: {
    assets: {
      background: "assets/images/page3/background.jpg",
      cake: "assets/images/page3/cake.webp",
    },

    heading: "Decorate Your Cake!",
    subtitle: "Create your own little masterpiece.",

    // 8 sticker dekorasi. Saat ini digambar sebagai SVG placeholder
    // (lihat page3-sticker-svgs.js). Kalau nanti punya PNG asli, tinggal
    // beri tahu — id di sini bisa dipetakan langsung ke file gambar.
    stickers: [
      { id: "cherry", label: "Cherry" },
      { id: "ribbon", label: "Ribbon" },
      { id: "flower", label: "Flower" },
      { id: "heart", label: "Heart" },
      { id: "cookie", label: "Cookie" },
      { id: "candy", label: "Candy" },
      { id: "star", label: "Star" },
      { id: "strawberry", label: "Strawberry" },
    ],

    tabs: {
      stickers: "Stickers",
      letters: "Letters",
    },
    trayToggleLabel: "Decorations",

    buttons: {
      undo: "Undo",
      redo: "Redo",
      finish: "Finish",
    },

    popup: {
      question: "Are you happy with your cake?",
      back: "Back",
      finish: "Finish",
    },
  },

  // ---------------------------------------------------------------------
  // PAGE 4 — BIRTHDAY WISHES
  // ---------------------------------------------------------------------
  page4: {
    assets: {
      background: "assets/images/page1/background_light.jpg", // asset yang sama dipakai lagi (nama file dari brief identik dengan Page 1)
      candleOn: "assets/images/page4/candle_on.webp",
      candleOff: "assets/images/page4/candle_off.webp",
      // 4 note pertama = ucapan dari kamu. Note ke-5 = Custom Wish.
      notes: [
        "assets/images/page4/note_1.webp",
        "assets/images/page4/note_2.webp",
        "assets/images/page4/note_3.webp",
        "assets/images/page4/note_4.webp",
        "assets/images/page4/note_5.webp",
      ],
    },

    heading: "Birthday Wishes",

    // Isi 4 ucapan dari kamu. Ganti/tambah teks di sini kapan saja —
    // masing-masing dirender di atas satu paper_note.
    wishes: [
      {
        message:
          "I hope you're blessed with a long, healthy life, plenty of wealth, endless confidence, and an extraordinary mind that continues to grow wiser every day.",
      },
      {
        message:
          "I hope you find your person soon, so you never have to feel lonely again. May they be kind, humble, and love you with all their heart.",
      },
      {
        message:
          "May you be blessed with abundant wealth, so you can continue giving to others, supporting your family and friends, and treating yourself to the things that make you happy.",
      },
      {
        message:
          "And I hope every wish you've away in your Notes app and every dream sitting in your TikTok drafts becomes a reality one day—whether sooner or later.",
      },
    ],

    customWish: {
      namePlaceholder: "Your name",
      wishPlaceholder: "Write your wish...",
      sendLabel: "Send",
      nameMissing: "Please enter your name.",
      wishMissing: "Please write your wish.",
    },

    blowButtonLabel: "Blow the Candle",
  },

  // ---------------------------------------------------------------------
  // PAGE 5 — THANK YOU
  // ---------------------------------------------------------------------
  page5: {
    assets: {
      background: "assets/images/page1/background_light.jpg",
      balloon: "assets/images/page5/balloon.webp",
    },

    // Baris ditampilkan satu per satu (sesuai brief: 3 baris + simbol hati).
    lines: ["Thank you", "for celebrating", "Mahen's birthday."],
    // Kalimat tambahan yang lebih personal, dari surat aslinya.
    extraLine: "I hope you'll always have people to celebrate you, today and every year to come.",
    heart: "♡",

    // Posisi balon dekoratif di sudut layar (persen dari layar penuh).
    decorations: [
      { top: "8%", left: "8%", rotate: -6, scale: 0.9 },
      { top: "12%", left: "80%", rotate: 8, scale: 0.75 },
      { top: "78%", left: "10%", rotate: 5, scale: 0.7 },
      { top: "72%", left: "84%", rotate: -8, scale: 0.85 },
    ],
  },
};