# Staff Voice — Analysis Dashboard

An offline dashboard for reviewing Staff Voice responses without exposing raw, individually-attributable data in a hosted environment.

## How to Use

1. Open your Google Sheet (the one your `backend/script.gs` deployment writes to).
2. Export the **Responses** sheet: `File → Download → Comma Separated Values (.csv)`.
3. Open `dashboard.html` in any browser (no server needed — it runs entirely client-side).
4. Import the exported CSV using the dashboard's upload control.

## Why Offline

Keeping this dashboard as a local, file-based tool (rather than a hosted page reading live from the Sheet) means:

- No API credentials or Sheet IDs need to live in a public repo or a hosted site
- School leadership controls exactly when and where response data is loaded
- The tool can be used by any school forking this project without exposing their own data pipeline

## Customizing

The rubric categories and Likert fields in `dashboard.html` mirror the field names in `frontend/index.html` and `backend/script.gs` (e.g. `wb_worklife`, `wl_planning`). If you change the form's questions, update the corresponding field names here to keep the three in sync.

## Leadership 360 Dashboard

`leadership-dashboard.html` works the same way for the **Leadership360** sheet tab: export it as CSV and load it in the page. It suppresses any selection under 5 responses, merges small groups, flags polite-answer patterns, and includes a triangulation worksheet (survey + listening circles + behavioural data). If you change the questions in `frontend/leadership.html`, keep the `ld_*` ids in sync with `backend/script.gs` and the `DIMS`/`REV`/`PAIRS` constants in the dashboard.
