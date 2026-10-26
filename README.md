# PWUTS_KODE_NIM – Website Kantin Kampus (Kelompok 7)

Tugas UTS Pemrograman Web. Topik mengikuti proposal **Website Kantin Kampus**.

- Nama: Mokhammad Fahim Imanudin
- NIM: 25091397110
- Kelompok: 7

## Pembagian Tugas Kelompok
| Anggota | Bagian |
|---|---|
| Mickel | Menu & Keranjang |
| Anto | Pemesanan & Penjualan |
| Saya | Beranda, Status & Riwayat Pesanan, Login/Registrasi |

## Struktur Folder
```
index.html              -> 2.a  Homepage (layout utama, responsive)
pages/status-riwayat.html -> 2.b Halaman konten interaktif
pages/login.html        -> 2.c  Halaman form + validasi
css/style.css           -> styling & media query responsive
js/main.js              -> navigasi AJAX (jQuery), hamburger menu, animasi angka
js/status.js            -> logika status pesanan & riwayat
js/auth.js              -> validasi form login & registrasi
php/proses_*.php        -> penerima data form (HTTP POST)
images/                 -> logo.svg, hero.svg
```

## Penjelasan Per Item
### 2.a Homepage (`index.html`)
- Layout: header sticky + navigasi, area konten `#content`, footer.
- **Responsive**: CSS Grid/Flexbox + media query (860px, 700px, 420px); navigasi menjadi hamburger di layar kecil; tabel riwayat berubah menjadi kartu di ponsel.
- **Ajax**: link navigasi (`data-page`) memuat halaman 2.b dan 2.c ke `#content` memakai `$.ajax()` (jQuery) tanpa reload; mendukung tombol back/forward lewat `history.pushState` dan hash URL (`#status`, `#login`).
- Gambar: `logo.svg`, `hero.svg`.

### 2.b Status & Riwayat Pesanan (`pages/status-riwayat.html`)
Sesuai use case "Melihat status pesanan" dan "Melihat riwayat pesanan".
- **Tab Status**: stepper progres (Menunggu Diproses → Siap Diambil → Selesai), rincian item & total.
- **Simulasi**: tombol "Naikkan Status", mode "Auto", dan "Reset" untuk meniru admin yang mengubah status.
- **Tab Riwayat**: pencarian (nomor/menu), filter status, urut kolom (klik header), detail item per pesanan, ringkasan jumlah/total/selesai yang ikut berubah sesuai filter.
- Data contoh meniru tabel `pesanan` dan `detail_pesanan`.

### 2.c Form Login & Registrasi (`pages/login.html`)
Sesuai tabel `users` (nama, username, password, role).
- Validasi JavaScript/jQuery: wajib isi, format username (4–50, huruf/angka/_), nama tanpa angka, password min. 8 + huruf & angka, konfirmasi password, role wajib dipilih, cek username sudah dipakai (simulasi).
- Validasi realtime (blur/input), indikator kekuatan password, tombol lihat password.
- Jika ada error, `submit` dibatalkan; jika valid, form dikirim POST ke `php/proses_login.php` / `php/proses_register.php`. Server memvalidasi ulang dan memakai `password_hash()`.

## Cara Menjalankan
AJAX tidak jalan jika `index.html` dibuka langsung (`file://`). Gunakan salah satu:
1. **VS Code Live Server** (klik kanan `index.html` → Open with Live Server), atau
2. **XAMPP**: salin folder ke `htdocs`, buka `http://localhost/PWUTS_KODE_NIM/` (agar file PHP juga berjalan), atau
3. **GitHub Pages** (halaman tampil, tetapi PHP tidak berjalan).

Butuh koneksi internet untuk memuat jQuery (CDN) dan font Google.

## Catatan
- Data pesanan masih data contoh (belum terhubung database).
- Pembagian fitur sudah dikoordinasikan dengan anggota kelompok agar tidak sama.
