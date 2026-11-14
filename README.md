# 🛠️ OH SNAP! Photobox — Dashboard Admin

Dashboard admin untuk mengelola seluruh konten website **OH SNAP! Photobox** ([ohsnap.web.id](https://ohsnap.web.id)) tanpa perlu menyentuh kode. Perubahan yang disimpan di sini langsung tampil di website untuk semua pengunjung.

> Repo ini hanya berisi dashboard admin. Kode website untuk pengunjung ada di repo terpisah: **ohsnap-frontend**.

---

## ✨ Fitur

Semua bagian di bawah ini bisa diubah dari satu dashboard:

- **Pengaturan Banner & Halaman Utama**
- **Kelola Halaman Video Feed**
- **Kelola Suasana Studio**
- **Kelola Promo**
- **Kelola Frame Layout**
- **Kelola Layanan**
- **Kelola Lokasi Cabang**
- **Kelola Informasi Footer** (Indonesia & Inggris)
- **Cakram Warna Frontend** — mengatur warna website, lengkap dengan tombol **Reset Default**
- **Permintaan Resend Softcopy** — melihat dan mengelola permintaan kirim ulang foto dari pelanggan
- **Kelola Admin** — menambah dan mengatur akun admin

Fitur pendukung:

- **Sinkron lewat cloud** — data tersimpan di Supabase, jadi bisa diubah dari perangkat mana pun.
- **Foto otomatis dikompres** sebelum diunggah, supaya website tetap ringan.
- **Perlindungan bentrok data** — kalau ada perubahan yang lebih baru di cloud, dashboard meminta muat ulang dan tidak menimpa diam-diam.
- **Salinan cadangan di browser** — mencegah data hilang saat koneksi bermasalah.

## 🔄 Cara Kerja

```
Dashboard Admin (repo ini)  ──simpan──▶  Cloud (Supabase)  ──baca──▶  Website OH SNAP!
```

Dashboard dan website terhubung lewat cloud, bukan lewat domain. Keduanya memakai penghubung yang sama (`cms-cloud.js`), sehingga data selalu konsisten.

## 📖 Cara Pakai

1. Buka halaman login admin dan masuk dengan akun admin.
2. Pilih bagian yang ingin diubah, lalu edit teks, foto, atau video.
3. Klik **Simpan Semua Perubahan** dan tunggu notifikasi bahwa data sudah tersimpan di cloud.
4. Buka website dan muat ulang untuk melihat hasilnya.
5. Setelah selesai, klik **Keluar**.

## 🔒 Keamanan

- Login diverifikasi di server, bukan hanya di browser.
- Sesi login berlaku per tab dan berakhir saat tab ditutup.
- **Jangan menyimpan username atau password di file mana pun di repo ini.**
- Jangan bagikan akun admin. Tambah akun terpisah lewat menu **Kelola Admin**.
- Selalu klik **Keluar** bila memakai perangkat bersama.

## 🗂️ Struktur Folder

```
.
├── index.html        # Halaman login admin
├── admin.html        # Dashboard admin
├── login.html        # Pengalih ke halaman login (untuk bookmark lama)
├── cms-cloud.js      # Penghubung ke cloud (harus sama dengan repo frontend)
├── images/           # Aset gambar (logo)
└── CNAME             # Pengaturan subdomain untuk GitHub Pages
```

Alamat halaman:

| Halaman | Alamat | File |
|---|---|---|
| Login | `/` | `index.html` |
| Dashboard | `/admin` | `admin.html` |

## 🧱 Teknologi

- **HTML, CSS, dan JavaScript** biasa, tanpa framework dan tanpa proses build
- **Supabase** — database konten, penyimpanan media, dan verifikasi login
- **GitHub Pages** + subdomain khusus (custom domain) — hosting

## 🚀 Deploy

Setiap perubahan yang di-push ke branch `main` otomatis tayang lewat GitHub Pages dalam 1–2 menit.

```bash
git add .
git commit -m "Deskripsi perubahan"
git push origin main
```

> ⚠️ Jangan hapus file **`CNAME`**. File ini menjaga subdomain admin tetap tersambung.
>
> ⚠️ File **`cms-cloud.js`** di repo ini dan di repo frontend harus selalu sama. Kalau salah satu diubah, ubah juga yang lain.

---

© OH SNAP! Photobox. Seluruh konten dan aset dalam repo ini adalah milik OH SNAP! Photobox.
