# alfath.dev · Landing Page Personal Branding

Situs pribadi **Farhan Abdillah Alfath**, guru ngaji yang bisa coding. Halaman satu layar-gulir yang memperkenalkan latar belakang mengajar Al-Quran dan pengembangan perangkat lunak, lengkap dengan proyek, pendidikan, dan pengalaman kerja.

Dibuat dengan HTML, CSS, dan sedikit JavaScript murni: tanpa framework, tanpa proses build, tanpa dependensi.

## Tampilan

- **Bingkai lengkung ala mihrab** untuk foto, dengan segel teks yang berputar.
- **Mode ngaji ⇄ mode coding**: tombol di navigasi yang mengganti seluruh palet warna dan huruf judul (krem berhuruf serif ↔ gelap berhuruf monospace). Mode awal mengikuti pengaturan terang/gelap perangkat.
- Pola bintang segi delapan tipis sebagai latar, daftar proyek bernomor, dan tombol bergaya bayangan keras.
- Responsif untuk ponsel dan desktop. Animasi dimatikan otomatis bagi pengguna yang memilih *reduced motion*.

## Isi Halaman

1. **Hero**: perkenalan singkat dan tombol ajakan.
2. **Tentang**: sisi ngaji dan sisi coding.
3. **Proyek**: edutajwid.com, Quran Tracking App, Warehouse Management System, Website Auladina.
4. **Jejak**: pendidikan dan pengalaman kerja.
5. **Kontak**: Instagram dan GitHub.

## Struktur

```
.
├── index.html   # seluruh halaman (HTML, CSS, JS)
├── foto.webp    # foto profil berlatar transparan
└── README.md
```

## Menjalankan Secara Lokal

```bash
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>
# buka index.html di browser
```

Koneksi internet hanya dibutuhkan untuk memuat huruf dari Google Fonts (Fraunces, Space Mono, Amiri). Tanpa koneksi, halaman memakai huruf cadangan sistem dan tetap terbaca.

## Deploy

Karena situs ini statis, cukup unggah isi repositori ke salah satu layanan berikut:

- **GitHub Pages**: *Settings → Pages*, pilih cabang `main` dan folder `/ (root)`. Repositori harus publik pada paket gratis.
- **Cloudflare Pages**: hubungkan repositori, kosongkan perintah build, dan isi direktori output dengan `/`.

Untuk domain kustom, tambahkan domain di pengaturan layanan di atas, lalu arahkan DNS-nya sesuai petunjuk yang ditampilkan.

## Menyesuaikan Isi

- **Teks, proyek, dan tautan**: edit langsung di `index.html`. Setiap proyek adalah satu blok `<article class="proj">`.
- **Warna**: ubah variabel CSS di bagian atas berkas (`:root` untuk mode ngaji, `[data-mode="coding"]` untuk mode coding).
- **Foto**: ganti `foto.webp` dengan foto berlatar transparan berukuran sekitar 3:4 agar pas di bingkai lengkung.

## Hak Cipta

Teks, foto, dan identitas pada situs ini adalah milik pribadi Farhan Abdillah Alfath. Silakan terinspirasi dari struktur dan gayanya, tetapi jangan menyalin foto atau konten pribadi tanpa izin.
