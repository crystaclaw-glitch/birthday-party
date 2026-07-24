/* =========================================================================
   PAGE 3 — PLACEHOLDER STICKER ARTWORK
   -------------------------------------------------------------------------
   8 sticker dekorasi & huruf A-Z belum ada file PNG-nya dari kamu, jadi
   sesuai keputusanmu, ini digambar sendiri sebagai SVG bergaya paper-cut
   (garis tangan + warna pastel, senada dengan palet asset asli).

   Kalau nanti kamu punya PNG asli:
   - Ganti STICKER_SVGS di bawah dengan <img src="..."> (lihat komentar
     di page3.js bagian renderTrayItem), ATAU
   - Simpan PNG di assets/images/page3/stickers/ dan aku sambungkan ke
     config.js — tinggal bilang saja.

   Semua menggunakan viewBox 0 0 100 100 supaya konsisten ukurannya.
   ========================================================================= */

const STICKER_SVGS = {
  cherry: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 30 C47 18,56 9,66 6" stroke="#4F7A72" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="65" cy="8" rx="8" ry="5.5" fill="#6E9C93" stroke="#453B33" stroke-width="2.2" transform="rotate(-25 65 8)"/>
      <path d="M50 30 C44 40,40 46,36 52" stroke="#4F7A72" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M50 30 C57 41,63 47,67 54" stroke="#4F7A72" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="35" cy="66" r="21" fill="#9C3532" stroke="#453B33" stroke-width="3"/>
      <circle cx="68" cy="70" r="21" fill="#B0413D" stroke="#453B33" stroke-width="3"/>
      <ellipse cx="28" cy="58" rx="5" ry="3.5" fill="#E7A6A3" opacity="0.8" transform="rotate(-30 28 58)"/>
      <ellipse cx="61" cy="62" rx="5" ry="3.5" fill="#E7A6A3" opacity="0.8" transform="rotate(-30 61 62)"/>
    </svg>`,

  ribbon: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 50 L14 24 C10 34,10 46,16 56 Z" fill="#6E9C93" stroke="#453B33" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 50 L86 24 C90 34,90 46,84 56 Z" fill="#84B3AD" stroke="#453B33" stroke-width="3" stroke-linejoin="round"/>
      <path d="M48 50 L20 78 C26 82,36 82,42 76 Z" fill="#6E9C93" stroke="#453B33" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 50 L80 78 C74 82,64 82,58 76 Z" fill="#84B3AD" stroke="#453B33" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="50" cy="50" r="11" fill="#4F7A72" stroke="#453B33" stroke-width="3"/>
    </svg>`,

  flower: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#453B33" stroke-width="2.5">
        <ellipse cx="50" cy="24" rx="13" ry="18" fill="#BBCCD6"/>
        <ellipse cx="50" cy="76" rx="13" ry="18" fill="#BBCCD6"/>
        <ellipse cx="24" cy="50" rx="18" ry="13" fill="#CBD9E0"/>
        <ellipse cx="76" cy="50" rx="18" ry="13" fill="#CBD9E0"/>
        <ellipse cx="32" cy="32" rx="14" ry="17" fill="#BBCCD6" transform="rotate(45 32 32)"/>
        <ellipse cx="68" cy="68" rx="14" ry="17" fill="#BBCCD6" transform="rotate(45 68 68)"/>
        <ellipse cx="68" cy="32" rx="14" ry="17" fill="#CBD9E0" transform="rotate(-45 68 32)"/>
        <ellipse cx="32" cy="68" rx="14" ry="17" fill="#CBD9E0" transform="rotate(-45 32 68)"/>
      </g>
      <circle cx="50" cy="50" r="14" fill="#F2D98A" stroke="#453B33" stroke-width="3"/>
    </svg>`,

  heart: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 88 C20 66,8 46,8 28 C8 12,26 4,38 14 C44 19,48 25,50 30
               C52 25,56 19,62 14 C74 4,92 12,92 28 C92 46,80 66,50 88 Z"
            fill="#9C3532" stroke="#453B33" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M28 26 C24 30,22 35,23 40" stroke="#E7A6A3" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.85"/>
    </svg>`,

  cookie: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#E4C79E" stroke="#453B33" stroke-width="3.5"/>
      <circle cx="36" cy="38" r="5.5" fill="#6B4A34" stroke="#453B33" stroke-width="1.5"/>
      <circle cx="62" cy="34" r="5" fill="#6B4A34" stroke="#453B33" stroke-width="1.5"/>
      <circle cx="68" cy="58" r="5.5" fill="#6B4A34" stroke="#453B33" stroke-width="1.5"/>
      <circle cx="44" cy="66" r="4.5" fill="#6B4A34" stroke="#453B33" stroke-width="1.5"/>
      <circle cx="30" cy="58" r="4" fill="#6B4A34" stroke="#453B33" stroke-width="1.5"/>
      <circle cx="55" cy="50" r="4" fill="#6B4A34" stroke="#453B33" stroke-width="1.5"/>
    </svg>`,

  candy: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 50 L10 30 C6 40,6 60,10 70 Z" fill="#F0EED9" stroke="#453B33" stroke-width="3" stroke-linejoin="round"/>
      <path d="M62 50 L90 30 C94 40,94 60,90 70 Z" fill="#F0EED9" stroke="#453B33" stroke-width="3" stroke-linejoin="round"/>
      <rect x="36" y="32" width="28" height="36" rx="14" fill="#9C3532" stroke="#453B33" stroke-width="3"/>
      <path d="M40 40 L60 60 M60 40 L40 60" stroke="#F0EED9" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    </svg>`,

  star: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 6 L61 38 L95 38 L67 58 L78 90 L50 70 L22 90 L33 58 L5 38 L39 38 Z"
            fill="#F2D98A" stroke="#453B33" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M50 24 L56 40" stroke="#FBF8F0" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
    </svg>`,

  strawberry: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 92 C24 78,14 54,20 38 C26 22,74 22,80 38 C86 54,76 78,50 92 Z"
            fill="#B0413D" stroke="#453B33" stroke-width="3.5" stroke-linejoin="round"/>
      <ellipse cx="38" cy="46" rx="3" ry="4.5" fill="#F0D9C9" transform="rotate(-20 38 46)"/>
      <ellipse cx="55" cy="55" rx="3" ry="4.5" fill="#F0D9C9" transform="rotate(10 55 55)"/>
      <ellipse cx="42" cy="65" rx="3" ry="4.5" fill="#F0D9C9" transform="rotate(-10 42 65)"/>
      <ellipse cx="62" cy="40" rx="3" ry="4.5" fill="#F0D9C9" transform="rotate(20 62 40)"/>
      <ellipse cx="60" cy="70" rx="3" ry="4.5" fill="#F0D9C9" transform="rotate(15 60 70)"/>
      <path d="M50 22 L38 6 L50 14 L62 6 Z" fill="#6E9C93" stroke="#453B33" stroke-width="3" stroke-linejoin="round"/>
    </svg>`,
};
