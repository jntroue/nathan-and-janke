/**
 * Nathan & Janke — RSVP backend (Google Apps Script)
 *
 * This lives inside a Google Sheet (Extensions > Apps Script) and is deployed
 * as a Web app. The wedding site posts each RSVP here; replies are written to
 * the "RSVPs" tab of that sheet. One row per name: replying again under the
 * same name updates the existing row instead of adding a second one.
 *
 * Setup steps are in the site's README.md under "RSVP form".
 *
 * The next line limits this script to the one sheet it lives in, so Google
 * only asks permission for that sheet rather than all your spreadsheets.
 * @OnlyCurrentDoc
 */

const SHEET_NAME = 'RSVPs';
const HEADERS = ['First replied', 'Last updated', 'Name', 'Attending', 'Message'];

// Opening the web app URL in a browser shows this, so you can tell it's deployed.
function doGet() {
  return json_({ ok: true, service: 'Nathan & Janke RSVP' });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad-request' });
  }

  const name = oneLine_(data.name, 80);
  if (name.length < 2) return json_({ ok: false, error: 'name' });

  // "Have we already had a reply under this name?" — answers yes/no and nothing else.
  if (data.action === 'check') {
    return json_({ ok: true, found: findRow_(sheet_(), name) > 0 });
  }

  if (data.action !== 'rsvp') return json_({ ok: false, error: 'bad-request' });

  const attending = data.attending === 'yes' ? 'Yes' : data.attending === 'no' ? 'No' : '';
  if (!attending) return json_({ ok: false, error: 'attending' });
  const message = String(data.message == null ? '' : data.message).trim().slice(0, 1000);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = sheet_();
    const row = findRow_(sheet, name);
    const now = new Date();
    if (row > 0) {
      sheet.getRange(row, 2, 1, 4).setValues([[now, text_(name), attending, text_(message)]]);
      return json_({ ok: true, updated: true });
    }
    sheet.appendRow([now, now, text_(name), attending, text_(message)]);
    return json_({ ok: true, updated: false });
  } finally {
    lock.releaseLock();
  }
}

// The "RSVPs" tab, created with headings the first time it's needed.
function sheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Row number of an existing reply for this name (0 if none).
// Matching ignores capitals, punctuation and extra spaces.
function findRow_(sheet, name) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const key = key_(name);
  const names = sheet.getRange(2, 3, last - 1, 1).getValues();
  for (let i = 0; i < names.length; i++) {
    if (key_(names[i][0]) === key) return i + 2;
  }
  return 0;
}

function key_(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9À-ɏ]+/g, ' ').trim();
}

function oneLine_(value, max) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max);
}

// Stop a reply that starts with = + - or @ from being run as a spreadsheet formula.
function text_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
