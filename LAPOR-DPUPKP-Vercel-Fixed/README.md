# LAPOR DPUPKP - Vercel

Frontend berada di root agar Vercel langsung membuka `index.html`.

## Backend
Google Apps Script menggunakan Spreadsheet ID dan Drive Folder ID yang sudah dikonfigurasi di `apps-script/Code.gs`.

Setelah Apps Script dideploy sebagai Web App, tambahkan di Vercel Environment Variables:

`APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec`

Tes koneksi:
`/api/test`
