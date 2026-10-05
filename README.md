# Staff Voice

**Anonymous staff feedback system for schools, built to protect honesty and surface real signal for school leadership.**

Live demo: https://podarstaffvoice.netlify.app

## Why This Exists

Most staff feedback in schools is either informal (hallway comments that don't reach leadership) or performative (surveys staff fear will be traced back to them). Staff Voice is a lightweight, anonymous feedback pipeline that any school can deploy in a few minutes — no backend server to maintain, no per-response cost, no vendor lock-in.

Built and used in production at Podar International School, Jahangirabad, Surat, and released here so other CBSE and K-12 schools can adopt, adapt, or extend it.

## How It Works

- **Frontend:** A simple, mobile-friendly form (deployed on Netlify) where staff submit feedback with no login or identifying fields.
- **Backend:** A Google Apps Script endpoint receives submissions and writes them directly to a Google Sheet — no database to provision, no server to patch.
- **Analysis:** A companion offline dashboard reads the exported sheet data and produces theme/sentiment breakdowns for school leadership, without ever exposing raw submissions in a way that could re-identify a respondent.

## Leadership 360 Module

A second, anonymous instrument for the **Principal's own growth** — how leadership is experienced by staff — designed to separate honest feedback from polite feedback.

- **`frontend/leadership.html`** — 13 rating statements across six dimensions (Vision, Instructional Leadership, Fairness, Approachability & Voice, Recognition & Development, Systems & Communication), four of them reverse-worded to catch box-ticking, plus open questions. Stores only the *date* (no time of day) and an optional broad group.
- **`analysis/leadership-dashboard.html`** — offline dashboard: dimension scores, group breakdown with **minimum group size of 5**, round-to-round change, a **polite-answer detector** (straight-lining, ceiling effect, self-contradiction, uniformity, duplicate wording), randomised unattributed comments, and a **triangulation worksheet**.
- **`docs/listening-circles-facilitator-guide.md`** — protocol and report template for an external facilitator running Principal-absent listening circles.

A finding is treated as real only when **three sources agree**: survey, listening circles, and behavioural data (attrition, absenteeism, participation).

Set `window.LEADERSHIP_CYCLE` in `config.js` (e.g. `2026-R1`) before each round so rounds can be compared.

## Getting Started (For Other Schools)

1. **Fork this repository.**
2. **Set up the Google Apps Script backend:**
   - Create a new Google Sheet to store responses.
   - Open Extensions → Apps Script, paste in `backend/script.gs`, and deploy it as a Web App (execute as "Me", accessible to "Anyone").
   - Copy the deployment URL.
3. **Configure the frontend:**
   - Copy `frontend/config.example.js` to `frontend/config.js` and paste your Apps Script URL. (Redeploy the Apps Script as a **new version** after pasting the updated `backend/script.gs` — the Leadership 360 form needs it.)
   - Update the form's submission endpoint in `index.html` (or `config.js`) with your Apps Script deployment URL.
4. **Deploy to Netlify** (a `netlify.toml` publishes `frontend/` and, if you set the `FORM_ENDPOINT` and `LEADERSHIP_CYCLE` environment variables in Netlify, generates `config.js` for you):
   - Connect your fork to Netlify, or drag-and-drop the `frontend/` folder into Netlify's deploy UI.
5. **(Optional) Set up the analysis dashboard** using the exported Sheet data — instructions in `analysis/README.md`.

## Anonymity & Data Handling Notes

- No authentication or identifying metadata (IP, device fingerprint) is collected by design. The pulse form records a timestamp per response; Leadership 360 records the **date only**. Do not share the raw sheet with anyone who could match submission times to people.
- Schools deploying this tool are responsible for their own data governance and compliance with local student/staff data protection requirements.
- This project provides the mechanism for anonymous collection; it does not provide legal guarantees of anonymity against determined re-identification (e.g., very small staff pools, distinctive phrasing).

## Contributing

Issues and pull requests are welcome — especially from other schools adapting this for their own context (multi-language forms, different rubric categories, alternate backend choices). Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

## License

Released under the [MIT License](./LICENSE) — free to use, fork, and adapt for your own institution.

## Maintainer

Manish Purani — Principal, Podar International School, Jahangirabad, Surat. CBSE Resource Person & Master Trainer.

---

*This site is powered by [Netlify](https://www.netlify.com).*
