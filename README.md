# 🛠️ OH SNAP! Photobox — Dashboard Admin

Dashboard admin untuk mengelola seluruh konten website **OH SNAP! Photobox** ([ohsnap.web.id](https://ohsnap.web.id)) tanpa perlu menyentuh kode.

> Repo ini khusus untuk dashboard admin (`admin.ohsnap.web.id`). Kode website pengunjung berada di repo terpisah: **ohsnap-frontend**.

---

## ✨ Fitur Utama

- **Pengaturan Konten Lengkap (ID & EN):** Banner & Hero Title, Video Feed, Suasana Studio, Promo, Frame Layout, Layanan, Lokasi Cabang (termasuk koordinat GPS otomatis dari URL Maps), Footer, dan Warna Frontend.
- **Permintaan Resend Softcopy:** Terhubung ke Google Spreadsheet via Google Apps Script (`POST` terautentikasi token sesi Supabase) dengan identifikasi baris berbasis UUID (`ID_UNIK`), paginasi, dan kunci anti-spam saat mengubah status.
- **Kelola Admin & Keamanan:** Daftar akun admin berbasis server (`bcrypt`), role `owner` / `admin`, fitur **Ganti Password Saya**, proteksi *brute-force* login di server, serta larangan menghapus akun sendiri atau owner terakhir.
- **Sinkronisasi Instan Multi-Perangkat:** Menggunakan **Supabase Realtime WebSocket** + *3-Way Field-Level Merge*, sehingga perubahan dari HP dan Laptop secara bersamaan otomatis menyatu tanpa saling menimpa.
- **Autosave Cerdas + Tombol Simpan:** Perubahan tersimpan otomatis ke Cloud setelah jeda 1,2 detik (atau saat berpindah kolom) apabila kolom wajib sudah terisi, dan dapat disimpan langsung lewat tombol **Simpan Semua Perubahan**.
- **Perlindungan Draft Offline & Sesi Habis:** Jika koneksi terputus atau sesi login (8 jam) habis, seluruh editan tersimpan aman di draft terpisah browser (`ohsnap_unsynced_draft`). Saat login ulang, dashboard menawarkan pilihan **Pulihkan Draft** atau **Pakai Data Cloud**.
- **Riwayat Versi Cloud (20 Versi) & Pemulihan 1-Klik:** Setiap penyimpanan atomik (`FOR UPDATE`) otomatis mencadangkan versi sebelumnya di `cms_settings_history` dan bisa dipulihkan lewat tombol **🕒 Riwayat**.
- **Cadangan & Pembersih Storage:** Tersedia tombol **📥 Backup JSON** untuk mengunduh cadangan seluruh konten dan tombol **🧹 Bersihkan File Yatim** bila ada file lama yang gagal terhapus.

## 🗂️ Struktur Folder

```
.
├── index.html                           # Halaman login admin (noindex + frame-buster)
├── admin.html                           # Dashboard admin utama
├── cms-cloud.js                         # Klien Supabase & Apps Script (harus identik dengan frontend)
├── vercel.json                          # Konfigurasi cleanUrls, redirect /login, & header keamanan
├── images/                              # Logo & favicon (32px, 180px, 512px)
├── .github/workflows/check-cms-cloud-sync.yml  # Cek kesamaan cms-cloud.js antar repo
└── CNAME                                # Referensi subdomain admin
```

## 🚀 Deploy (Vercel)

Setiap `git push origin main` otomatis men-deploy versi terbaru di **Vercel** (`https://admin.ohsnap.web.id`) dalam 30–60 detik:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push origin main
```

---

© OH SNAP! Photobox. Seluruh konten dan aset dalam repo ini adalah milik OH SNAP! Photobox.
