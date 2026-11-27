# 🛠️ OH SNAP! Photobox — Dashboard Admin

Dashboard untuk mengelola seluruh konten website **OH SNAP! Photobox** ([web.ohsnap.id](https://web.ohsnap.id)) dan memantau permintaan *Resend Softcopy* tanpa menyentuh kode.

- **Alamat:** `https://admin.ohsnap.web.id` (halaman login) → `/admin/...` (dashboard)
- **Repo pasangan:** website publik ada di repo terpisah, **ohsnap-frontend**.
- **Teknologi:** HTML + JavaScript murni (tanpa framework/build), satu *serverless function* Vercel untuk login, Supabase (database, penyimpanan media, Realtime), Google Apps Script + Google Spreadsheet + Google Drive (data Resend Softcopy), Cloudflare Turnstile (anti-bot login).

---

## 🧭 Cara Kerja Singkat

```
Admin (browser)
   │  1. login ──► /api/login (Vercel Function) ──► verifikasi Cloudflare Turnstile ──► Supabase (cek akun)
   │  2. edit konten ─────────────────────────────► Supabase (tabel konten + Storage media + riwayat versi)
   │  3. lihat / ubah status / hapus permintaan Resend ──► Google Apps Script ──► Spreadsheet + Drive
   ▼
Website publik (ohsnap-frontend) membaca konten yang sama dari Supabase
```

1. **Login.** Username + password + centang Cloudflare Turnstile dikirim ke `/api/login`. Fungsi ini memeriksa Turnstile terlebih dahulu, baru meneruskan pengecekan akun ke Supabase memakai kunci rahasia server. Hasilnya berupa *token sesi* yang disimpan di `sessionStorage` (hilang saat tab ditutup). Sesi berlaku 8 jam dan diperpanjang setiap kali ada penyimpanan.
2. **Konten** (teks, daftar kartu, warna, tautan gambar/video) disimpan sebagai satu data JSON di Supabase. File gambar/video disimpan di Supabase Storage.
3. **Resend Softcopy** tidak disimpan di Supabase, melainkan di Google Spreadsheet lewat Google Apps Script. Setiap permintaan dari dashboard membawa token sesi, dan Apps Script memverifikasinya ke Supabase sebelum membaca atau mengubah data.

---

## ✨ Fitur Dashboard

### Menu (alamat URL mengikuti menu: `/admin/<grup>/<menu>`)

| Grup | Menu | Fungsi |
|---|---|---|
| **Halaman Utama** | Banner & Hero | Pilih halaman (Home, About Our Story, Layanan, Frame, Lokasi): judul dan deskripsi (ID/EN), gambar banner. Untuk *About*: teks tombol, cerita lengkap (ID/EN), dan foto About Our Story. |
| | Suasana Studio | Judul & subjudul seksi (ID/EN) dan daftar kartu studio (nama ID/EN, deskripsi ID/EN, foto). |
| | Promo | Judul & subjudul seksi (ID/EN) dan daftar kartu promo (judul ID/EN, badge, deskripsi ID/EN, gambar poster). |
| | Video Feed | Judul & subjudul seksi (ID/EN) dan daftar video: judul, file video (unggah atau isi link) dan *Link Tujuan* (mis. halaman TikTok/Instagram). Thumbnail dibuat otomatis saat video diunggah. |
| **Halaman Lain** | Layanan | Daftar layanan: judul (ID/EN), harga, deskripsi (ID/EN), foto. |
| | Frame Layout | Daftar frame: nama (ID/EN), kategori, deskripsi (ID/EN), gambar. |
| | Lokasi Cabang | Daftar cabang: nama, lantai, jam buka, URL Google Maps, latitude/longitude (terisi otomatis dari URL Maps bila memuat koordinat, tetap bisa diisi manual), foto. |
| | Resend Softcopy | Daftar permintaan pelanggan dari Spreadsheet (lihat bagian di bawah). |
| | Kontak | Nama dan tautan Instagram, TikTok, WhatsApp, dan Email yang tampil di halaman Kontak. |
| **Pengaturan** | Footer | Nama brand, alamat pusat, Instagram/TikTok, judul & deskripsi kartu lokasi (ID/EN), hak cipta. |
| | Warna Frontend | Empat warna tema (utama, teks, background, footer) dengan pemilih warna/kode hex dan tombol *Reset Default*. |
| | Kelola Admin | Daftar akun, tambah/hapus akun (khusus Owner), ganti password sendiri, dan *Cek IP Login* (khusus Owner). |

Kartu pada Video, Studio, Promo, Frame, Layanan, dan Lokasi dapat ditambah, dihapus, dan diurutkan ulang.

### Bilah atas
- **Status sinkron** (mis. "Tersimpan di Cloud", "Offline (Draft Tersimpan Lokal)").
- **Bersihkan File** — muncul hanya bila ada file media lama yang gagal terhapus; tombol ini menghapus file yang sudah tidak dipakai.
- **Riwayat** — daftar versi konten sebelumnya (maksimal 50 versi) dengan tombol *Pulihkan*.
- **Backup JSON** — mengunduh cadangan seluruh konten sebagai berkas JSON.
- **Simpan Perubahan** — menyimpan ke Cloud sekarang juga.

### Unggah media
- **Gambar** dikompres otomatis di browser (WebP, atau JPEG bila WebP tidak didukung) dan diperkecil sebelum diunggah.
- **Video** yang diunggah maksimal **3 MB**; untuk video lebih besar gunakan link TikTok/Instagram.
- File lama otomatis dihapus dari Storage setelah file pengganti berhasil tersimpan ke Cloud.

### Resend Softcopy
Tabel permintaan memuat: tanggal/jam masuk, tanggal/jam foto, nama, nomor HP, email, cabang, foto bukti, dan status.
- **Muat Lebih Banyak** — daftar dimuat bertahap; penanda jumlah permintaan yang masih *Belum* ditampilkan di atas tabel.
- **Lihat Foto** — membuka foto bukti yang tersimpan di Google Drive.
- **Kirim** — membuka WhatsApp atau email (Gmail/aplikasi email) ke pelanggan dengan pesan template.
- **Status** — ubah *Belum* ↔ *Sudah*; perubahan langsung ditulis ke Spreadsheet.
- **Hapus** — menghapus permintaan dari dashboard dan Spreadsheet (ada konfirmasi).
- Baris dikenali lewat ID unik (kolom `ID_UNIK` di Spreadsheet), bukan nomor baris, sehingga aman walau baris bergeser.

### Kelola Admin
- Dua peran: **Owner** dan **Admin**. Hanya Owner yang dapat menambah/menghapus akun dan memakai *Cek IP Login*.
- Akun yang sedang dipakai dan Owner terakhir tidak dapat dihapus.
- Akun yang ditandai wajib ganti password akan langsung diminta membuat password baru saat masuk.
- Setiap admin bisa mengganti password sendiri. Semua kolom password memiliki ikon mata untuk menampilkan/menyembunyikan teks.
- Setelah login, sidebar menyapa dengan **nama** akun (bukan username).

---

## 🔄 Penyimpanan & Sinkronisasi Multi-Perangkat

- **Simpan otomatis:** perubahan disimpan ke Cloud sekitar 1,2 detik setelah berhenti mengetik, selama kolom wajib terisi (judul Home, judul dan harga layanan, nama lokasi, kode warna valid). Tombol *Simpan Perubahan* tetap tersedia.
- **Beberapa admin/perangkat sekaligus:** dashboard memakai *3-way field-level merge*. Perubahan pada bagian berbeda dari HP dan laptop digabung otomatis; jika kolom yang sama diubah bersamaan, muncul banner penyelesaian konflik.
- **Pembaruan langsung:** dashboard terhubung ke Supabase Realtime (WebSocket). Bila koneksi belum tersambung, dashboard mengecek perubahan secara berkala sebagai cadangan.
- **Draft aman:** bila koneksi terputus atau sesi habis, editan disimpan sebagai draft di browser. Saat login ulang, tersedia pilihan **Pulihkan Draft** atau **Pakai Data Cloud**.
- **Riwayat versi:** versi sebelumnya dicadangkan di database dan bisa dipulihkan dari tombol *Riwayat*.

---

## 🔐 Keamanan (gambaran umum)

- Login wajib melewati Cloudflare Turnstile dan fungsi server `/api/login`; fungsi login di database tidak dapat dipanggil langsung dari browser.
- Password disimpan sebagai hash bcrypt; ada pembatasan percobaan login yang gagal.
- Semua penyimpanan konten dan pengelolaan akun memakai token sesi dan diperiksa di database.
- Unggah dan hapus file di Storage memerlukan izin sementara per file.
- Apps Script memverifikasi token sesi dan memeriksa isi file foto sebelum menyimpannya.
- Header keamanan (CSP, HSTS, anti-iframe) diatur di `vercel.json`; halaman admin tidak diindeks mesin pencari (`robots.txt` dan header `noindex`).

> Kunci rahasia **tidak** disimpan di repo ini. Lihat bagian *Konfigurasi*.

---

## 🗂️ Struktur Folder

```
.
├── index.html                  # Halaman login (noindex, Turnstile, ikon mata)
├── admin.html                  # Dashboard utama
├── cms-cloud.js                # Klien Supabase & Apps Script (harus IDENTIK dengan repo frontend)
├── api/
│   └── login.js                # Vercel Function: verifikasi Turnstile + login ke Supabase
├── vercel.json                 # cleanUrls, rewrite /admin/*, redirect /login, header keamanan & CSP
├── robots.txt                  # Melarang seluruh crawler
├── favicon.ico, images/        # Ikon & logo
├── CNAME                       # Referensi subdomain admin
└── .github/workflows/
    └── check-cms-cloud-sync.yml  # Memastikan cms-cloud.js sama dengan repo frontend
```

---

## ⚙️ Konfigurasi

**Environment Variables di Vercel** (Project → Settings → Environment Variables). Isi nilainya hanya di Vercel, jangan pernah ditulis di repo atau chat:

| Nama | Fungsi |
|---|---|
| `TURNSTILE_SECRET_KEY` | Kunci rahasia Cloudflare Turnstile untuk memverifikasi login |
| `SUPABASE_URL` | Alamat proyek Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci rahasia server Supabase (hanya dipakai `api/login.js`) |

**Di kode (aman dipublikasikan):** kunci publik Supabase dan alamat Web App Apps Script berada di `cms-cloud.js`; *site key* Turnstile berada di `index.html`. Widget Turnstile login harus mencantumkan hostname `admin.ohsnap.web.id`.

**Google Apps Script:** kode ada di proyek Apps Script terpisah (bukan di repo ini). Pengaturan rahasianya ada di *Script Properties* proyek tersebut.

---

## 🚀 Deploy

Setiap `git push` ke branch `main` otomatis di-deploy oleh **Vercel** dalam sekitar 1 menit:

```bash
git add .
git commit -m "Deskripsi perubahan"
git pull --rebase origin main
git push origin main
```

> **Penting:** `cms-cloud.js` harus identik di repo admin dan frontend. Bila diubah, salin ke repo pasangan, lalu push keduanya. Workflow `check-cms-cloud-sync` akan menandai gagal bila berbeda.

---

© OH SNAP! Photobox. Seluruh konten dan aset dalam repo ini adalah milik OH SNAP! Photobox.
