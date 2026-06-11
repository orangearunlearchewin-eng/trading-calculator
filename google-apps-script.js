/**
 * Position Size Calculator - Google Apps Script Web App (optional)
 *
 * Logs trade plans calculated by index.html into a Google Sheet.
 *
 * Setup:
 * 1. Open your Google Sheet -> Extensions -> Apps Script
 * 2. Replace the default code with this file's contents
 * 3. SECRET_TOKEN below must match the Token saved in the calculator's Settings tab
 * 4. Deploy -> New deployment -> Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the Web App URL and paste it into the calculator's Settings -> Backend URL
 */

const SECRET_TOKEN = 'pond-trading-2026';
const SHEET_NAME = 'Trade Plans';
const HEADER_ROW = [
  'Logged At', 'Instrument', 'Direction', 'Entry', 'Stop', 'Target',
  'Contracts', 'Risk $', 'Reward $', 'R:R', 'Stop Ticks'
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.token !== SECRET_TOKEN) {
      return jsonResponse({ success: false, error: 'Unauthorized' });
    }

    const sheet = getOrCreateSheet();
    sheet.appendRow([
      new Date(),
      body.instrument || '',
      body.direction || '',
      body.entry,
      body.stop,
      body.target,
      body.contracts,
      body.dollarRisk,
      body.dollarReward,
      body.rrRatio,
      body.stopTicks
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doGet(e) {
  return jsonResponse({ success: true, message: 'Position Size Calculator Apps Script is running' });
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
