# LAPOR DPUPKP

Starter project untuk LAPOR DPUPKP.

## Struktur

- `public/` — frontend Vercel
- `api/test.js` — proxy test ke Google Apps Script
- `apps-script/Code.gs` — backend Google Apps Script
- `vercel.json` — konfigurasi Vercel
- `.env.example` — environment variable

## 1. Google Apps Script

Salin `apps-script/Code.gs` ke project Apps Script yang sudah dibuat.

Spreadsheet:
`1dvG2zXNpUyRMRjWky8CSyHxg4_fWSaJF5WjEJhoeUm4`

Google Drive:
`1VCMNBzL9hjKyLUUIK49ef1HpcFJW56RP`

Jalankan `testConnection`, lalu `setupSystem`.

Deploy Apps Script sebagai Web App:
- Execute as: Me
- Who has access: Anyone

Salin URL `/exec`.

## 2. Deploy Vercel

Upload repository/folder ini ke GitHub atau import project langsung ke Vercel.

Tambahkan Environment Variable:

`APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec`

Setelah deploy, buka:

`/api/test`

Jika koneksi berhasil, response akan menunjukkan:

`spreadsheet: true`

`drive: true`

## Catatan

Form frontend pada versi starter ini sudah memiliki UI dinamis dan responsive, tetapi proses submit/upload ke Spreadsheet dan Drive sengaja belum diaktifkan. Setelah endpoint Apps Script terbukti berhasil, tahap berikutnya adalah menghubungkan submit, generate ID, upload file, dan cek status.
