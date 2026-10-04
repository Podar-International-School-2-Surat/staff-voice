/**
 * Staff Voice — Google Apps Script backend
 *
 * Deploy this as a Web App bound to a Google Sheet:
 *   Extensions → Apps Script → paste this file → Deploy → New deployment
 *   Type: Web app | Execute as: Me | Who has access: Anyone
 *
 * Copy the resulting /exec URL into frontend/config.js (see config.example.js).
 * Do NOT commit your real deployment URL to this public repo — it is a live
 * write endpoint into your school's response sheet with no authentication.
 *
 * Two forms post here:
 *   - Staff Voice pulse (frontend/index.html)       -> sheet "Responses"
 *   - Leadership 360   (frontend/leadership.html)   -> sheet "Leadership360"
 *     (identified by payload.form === 'leadership360')
 */

var PULSE_HEADERS = ['Timestamp','wb_worklife','wb_support','wb_stress','wb_valued','wb_open',
                     'wl_planning','wl_duties','wl_assessment','wl_meetings','wl_open',
                     'gp_practice','gp_colleague','sv_change','sv_unknown','ctx_wing','ctx_tenure'];

// Leadership 360 deliberately stores the DATE only (no time of day), so a
// response can never be matched to someone's known submission time.
var LEADERSHIP_HEADERS = ['Date','ld_cycle','ld_group',
                          'ld_v1','ld_v2','ld_i1','ld_i2','ld_f1','ld_f2',
                          'ld_a1','ld_a2','ld_r1','ld_r2','ld_s1','ld_s2',
                          'ld_overall','ld_help','ld_change','ld_unsaid'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);

    // Honeypot: a hidden field real users never fill. Silently drop bot posts.
    if (data.website) return ok_();

    if (data.form === 'leadership360') {
      writeRow_('Leadership360', LEADERSHIP_HEADERS, data, function (h) {
        return h === 'Date'
          ? Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')
          : null;
      });
    } else {
      writeRow_('Responses', PULSE_HEADERS, data, function (h) {
        return h === 'Timestamp' ? new Date() : null;
      });
    }
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function writeRow_(sheetName, headers, data, special) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  var row = headers.map(function (h) {
    var s = special(h);
    return s !== null ? s : clean_(data[h]);
  });
  sheet.appendRow(row);
}

// Stop spreadsheet formula injection (=, +, -, @) and cap length.
function clean_(v) {
  if (v === undefined || v === null) return '';
  v = String(v).substring(0, 3000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
