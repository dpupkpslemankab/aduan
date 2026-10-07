/*******************************************************
 * LAPOR DPUPKP SLEMAN
 * GOOGLE APPS SCRIPT BACKEND
 *
 * Salin file ini ke project Google Apps Script.
 *******************************************************/

const CONFIG = {
  SPREADSHEET_ID: '1dvG2zXNpUyRMRjWky8CSyHxg4_fWSaJF5WjEJhoeUm4',
  DRIVE_FOLDER_ID: '1VCMNBzL9hjKyLUUIK49ef1HpcFJW56RP',
  SHEETS: {
    DATABASE: 'DATABASE',
    MONITORING: 'MONITORING',
    MASTER_TOPIK: 'MASTER TOPIK',
    LOG: 'LOG'
  }
};

function doGet(e) {
  try {
    const action = e?.parameter?.action || 'test';

    if (action === 'test') return jsonResponse(testConnectionAPI());
    if (action === 'setup') return jsonResponse(setupSystem());

    return jsonResponse({
      success: false,
      message: 'Action tidak dikenal.',
      available_actions: ['test', 'setup']
    });
  } catch (error) {
    return jsonResponse({ success: false, message: error.message });
  }
}

function doPost(e) {
  return jsonResponse({
    success: true,
    message: 'POST API LAPOR DPUPKP aktif.'
  });
}

function testConnection() {
  let spreadsheet;
  let driveFolder;

  try {
    spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    console.log('================================');
    console.log('✅ SPREADSHEET TERHUBUNG');
    console.log('Nama Spreadsheet: ' + spreadsheet.getName());
    console.log('Spreadsheet ID: ' + spreadsheet.getId());
    console.log('Spreadsheet URL: ' + spreadsheet.getUrl());
    console.log('Spreadsheet: TRUE');
  } catch (error) {
    console.error('❌ SPREADSHEET GAGAL');
    console.error(error.message);
    return;
  }

  try {
    driveFolder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    console.log('================================');
    console.log('✅ GOOGLE DRIVE TERHUBUNG');
    console.log('Nama Folder: ' + driveFolder.getName());
    console.log('Drive Folder ID: ' + driveFolder.getId());
    console.log('Drive Folder URL: ' + driveFolder.getUrl());
    console.log('Google Drive: TRUE');
  } catch (error) {
    console.error('❌ GOOGLE DRIVE GAGAL');
    console.error(error.message);
    return;
  }

  console.log('================================');
  console.log('🎉 SEMUA KONEKSI BERHASIL');
  console.log('Spreadsheet: TRUE');
  console.log('Google Drive: TRUE');
  console.log('================================');
}

function testConnectionAPI() {
  let spreadsheet;
  let driveFolder;

  try {
    spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } catch (error) {
    return {
      success: false,
      connection: { spreadsheet: false, drive: false },
      message: 'Google Spreadsheet gagal diakses.',
      error: error.message
    };
  }

  try {
    driveFolder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  } catch (error) {
    return {
      success: false,
      connection: { spreadsheet: true, drive: false },
      message: 'Spreadsheet berhasil diakses, tetapi Google Drive gagal diakses.',
      error: error.message
    };
  }

  return {
    success: true,
    message: 'Koneksi Google Spreadsheet dan Google Drive berhasil.',
    connection: { spreadsheet: true, drive: true },
    spreadsheet: {
      id: spreadsheet.getId(),
      name: spreadsheet.getName(),
      url: spreadsheet.getUrl()
    },
    drive: {
      id: driveFolder.getId(),
      name: driveFolder.getName(),
      url: driveFolder.getUrl()
    }
  };
}

function setupSystem() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const result = [];

  const database = getOrCreateSheet(spreadsheet, CONFIG.SHEETS.DATABASE);
  setHeader(database, [
    'ID', 'Timestamp', 'Jenis', 'Topik', 'Kode Bidang', 'Bidang',
    'Nama', 'WhatsApp', 'Email', 'Alamat', 'Data/Form',
    'File Pendukung', 'Status', 'Catatan'
  ]);
  result.push(CONFIG.SHEETS.DATABASE);

  const monitoring = getOrCreateSheet(spreadsheet, CONFIG.SHEETS.MONITORING);
  setHeader(monitoring, [
    'ID', 'Tanggal', 'Penanggung Jawab Aduan', 'Identitas Pelapor',
    'Topik', 'Informasi', 'Status', 'Bidang', 'Catatan'
  ]);
  result.push(CONFIG.SHEETS.MONITORING);

  const masterTopik = getOrCreateSheet(spreadsheet, CONFIG.SHEETS.MASTER_TOPIK);
  setHeader(masterTopik, ['Topik', 'Kode', 'Bidang', 'Jenis']);

  const topics = [
    ['Permohonan Informasi Data', 'SEKRE', 'Sekretariat', 'Permohonan'],
    ['Permohonan Magang', 'SEKRE', 'Sekretariat', 'Permohonan'],
    ['Perizinan PBG dan SLF', 'P3B', 'P3B', 'Aduan'],
    ['Jalan/Jembatan', 'BM', 'Bina Marga', 'Aduan'],
    ['Drainase', 'CK', 'Cipta Karya', 'Aduan'],
    ['Irigasi', 'SDA', 'Sumber Daya Air', 'Aduan'],
    ['Air Minum/SPAM', 'CK', 'Cipta Karya', 'Aduan'],
    ['Perumahan/Rusunawa', 'PR', 'Perumahan', 'Aduan'],
    ['Yang lain', 'LAIN', '', 'Aduan']
  ];

  if (masterTopik.getLastRow() > 1) {
    masterTopik
      .getRange(2, 1, masterTopik.getLastRow() - 1, 4)
      .clearContent();
  }

  masterTopik.getRange(2, 1, topics.length, 4).setValues(topics);
  result.push(CONFIG.SHEETS.MASTER_TOPIK);

  const log = getOrCreateSheet(spreadsheet, CONFIG.SHEETS.LOG);
  setHeader(log, ['Timestamp', 'Action', 'Status', 'Keterangan']);
  result.push(CONFIG.SHEETS.LOG);

  [database, monitoring, masterTopik, log].forEach(formatSheet);

  log.appendRow([
    new Date(),
    'SETUP SYSTEM',
    'SUCCESS',
    'Struktur LAPOR DPUPKP berhasil disiapkan.'
  ]);

  return {
    success: true,
    message: 'Setup LAPOR DPUPKP berhasil.',
    spreadsheet: {
      id: spreadsheet.getId(),
      name: spreadsheet.getName(),
      url: spreadsheet.getUrl()
    },
    sheets: result,
    drive_folder: { id: CONFIG.DRIVE_FOLDER_ID }
  };
}

function getOrCreateSheet(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function setHeader(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
}

function formatSheet(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn > 0) {
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, lastColumn).setFontWeight('bold');
    sheet.autoResizeColumns(1, lastColumn);
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
