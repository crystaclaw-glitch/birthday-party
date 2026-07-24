# Mahen's Birthday Scrapbook Experience

Website ucapan ulang tahun interaktif bertema paper-scrapbook. Single Page
Application — seluruh perpindahan halaman dianimasikan dengan GSAP, tanpa
reload.

## Struktur project

```
/
├── index.html                  <- satu-satunya halaman HTML (semua page adalah <section> di dalamnya)
├── config.js                   <- SEMUA konten yang bisa kamu ubah (nama, teks, path asset, audio)
└── assets/
    ├── images/
    │   ├── page1/               <- envelope, invitation card, sticker, background
    │   ├── page2/                <- background, sticker dekorasi kalender, cake CTA
    │   ├── page3/                 <- background, cake polos
    │   ├── page4/                  <- candle on/off, 5 paper note
    │   ├── page5/                   <- balloon sticker
    │   └── shared/                 <- asset dipakai lintas halaman (paper grain texture)
    ├── audio/                  <- background_music, pop, paper_open, blow
    ├── fonts/                  <- kosong; font saat ini dimuat lewat Google Fonts CDN (lihat catatan di bawah)
    ├── css/
    │   └── style.css           <- semua styling, dari token warna sampai layout tiap page
    └── js/
        ├── main.js             <- entry point, boot semua module
        ├── router.js           <- SPA router ringan (swap page + flash transition)
        ├── audio-manager.js    <- background music fade + sound effect
        ├── ui-helpers.js        <- hover/press feedback bersama (dipakai semua page)
        ├── state.js             <- AppState — dekorasi kue disimpan di sini, dibaca ulang oleh Page 4
        └── pages/
            ├── page1.js         <- logic Page 1
            ├── page2.js          <- logic Page 2
            ├── page3-sticker-svgs.js  <- ilustrasi SVG placeholder 8 sticker
            ├── page3.js           <- logic Page 3 (drag & drop, tray, undo/redo)
            ├── page4.js            <- logic Page 4 (cake echo, wishes, blow candle)
            └── page5.js             <- logic Page 5 (thank you, penutup)
```

Setiap page mengikuti pola yang sama: satu `<section id="pageX" class="page" hidden>`
di `index.html`, satu file `assets/js/pages/pageX.js`, didaftarkan di
`main.js`. Kalau suatu saat ingin menambah halaman baru lagi, tidak ada
yang perlu direstrukturisasi — tinggal ikuti pola yang sama.

## Cara mengubah konten

Buka `config.js` — semua nama, tanggal, teks undangan, dan path asset ada
di situ dengan komentar penjelasan. Tidak perlu menyentuh file `.js`
lainnya untuk sekadar mengganti teks.

## Font

Saat ini font (`Caveat` untuk judul/handwriting besar, `Patrick Hand` untuk
body text) dimuat lewat Google Fonts CDN di `<head>` pada `index.html`.
Ini butuh koneksi internet saat website dibuka. Kalau nanti kamu punya
file font sendiri dan ingin self-host:

1. Taruh file `.woff2` di `assets/fonts/`
2. Tambahkan `@font-face` di bagian atas `assets/css/style.css`
3. Hapus tag `<link>` Google Fonts di `index.html`

## Menjalankan secara lokal

Karena ini pure static site (tanpa build step), cukup jalankan static
server apa saja dari root folder, misalnya:

```bash
python3 -m http.server 8080
# lalu buka http://localhost:8080
```

(Membuka `index.html` langsung lewat `file://` bisa bermasalah di
beberapa browser karena kebijakan CORS pada fetch audio/gambar — selalu
gunakan local server.)

## Deploy ke Cloudflare Pages

1. Push seluruh folder ini ke repository GitHub.
2. Di Cloudflare Pages, pilih **Create a project → Connect to Git**, pilih
   repo ini.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** (kosongkan)
   - **Build output directory:** `/`
4. Deploy. Karena semua path asset relatif dan tidak ada build step, ini
   akan langsung jalan tanpa konfigurasi tambahan.

## Status halaman

- ✅ Page 1 — Birthday Invitation (selesai)
- ✅ Page 2 — Save The Date (selesai)
- ✅ Page 3 — Decorate Your Cake (selesai — lihat catatan sticker di bawah)
- ✅ Page 4 — Birthday Wishes (selesai)
- ✅ Page 5 — Thank You (selesai — halaman terakhir, tanpa tombol apapun sesuai brief)

Seluruh alur SPA dari Page 1 sampai Page 5 sudah bisa dicoba end-to-end
tanpa reload dan tanpa placeholder kosong.

## Catatan khusus Page 3 — sticker & huruf masih placeholder

8 sticker dekorasi (cherry, ribbon, flower, heart, cookie, candy, star,
strawberry) dan huruf A–Z belum ada file PNG aslinya darimu, jadi untuk
sekarang semuanya digambar sendiri sebagai SVG bergaya paper-cut di:

- `assets/js/pages/page3-sticker-svgs.js` — 8 ilustrasi SVG untuk sticker
- Huruf A–Z dibuat langsung di `page3.js` sebagai elemen "sobekan
  kertas" bertuliskan huruf (CSS clip-path + font tulisan tangan),
  bukan file gambar terpisah

Begitu kamu punya PNG asli, tinggal beri tahu — tinggal ganti isi
`STICKER_SVGS` dengan `<img src="...">` atau taruh file di
`assets/images/page3/stickers/` dan aku sambungkan lewat `config.js`.
Sistem drag-and-drop-nya tidak perlu diubah sama sekali karena ia
memperlakukan hasil render itu sebagai "elemen visual" generik.

## Catatan lain

- Page 4 dan Page 5 memakai ulang `assets/images/page1/background_light.jpg`
  (stripe biru-cream yang sama seperti Page 1) — sesuai brief asli yang
  menyebut nama file background yang identik di ketiga halaman itu.
- Efek asap saat lilin ditiup (Page 4) dan efek confetti kecil saat
  menekan "Join" (Page 1) sama-sama dibuat murni dari CSS/GSAP, tanpa
  file gambar — supaya ringan dan gampang disesuaikan.
