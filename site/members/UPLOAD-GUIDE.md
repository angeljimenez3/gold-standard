# Gold Standard Member Area — Content Upload Guide

The member area is fully built and pre-structured with the complete course:
**3 tracks × 20 lessons (60 lessons, 6 shared videos filmed once) + 72-movement Exercise Demo Library.**

Uploading content = pasting Google Drive file IDs into one file. No code changes needed anywhere else.

## Uploading a video (2 minutes per video)

1. Upload the edited video to Google Drive (any folder — suggest one folder per track + one for demos).
2. Right-click the file → **Share** → General access: **Anyone with the link** → **Viewer**.
3. Copy the link. It looks like:
   `https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing`
   The FILE ID is the part between `/d/` and `/view` → `1AbCdEfGhIjKlMnOp`
4. Open `js/content.js` and paste the ID into the matching `driveId: ""`.

## Where things go in `js/content.js`

| Content | Where |
|---|---|
| The 6 shared videos (Welcome, Meet Hannah, System, Weights, Warm-Up, Mindset) | `SHARED` object at the top — paste once, appears in all 3 tracks |
| Track-specific lessons (14 per track) | Inside each track's `buildTrack({...})` lessons — look for `driveId: ""` |
| Exercise demos | `EXERCISE_LIBRARY` array — one line per movement |
| Access code members use to log in | `CONFIG.accessCode` (change before launch!) |
| Support email | `CONFIG.supportEmail` |

## Captions

Drive's player supports captions: in Drive, open the video → ⋮ → **Manage caption tracks** → upload the `.srt`. They'll show in the member area player automatically (per the captioning requirement from the June 9 call).

## Testing locally

Open `index.html` in a browser (or `npx serve site` from the repo root). Log in with any email + the access code from `CONFIG.accessCode`.

## Deploying

The member area lives inside the existing site, so it ships with the same Vercel deploy:

```bash
cd site && npx vercel --prod
```

It'll be live at `/members/` on the site's domain.

## Important notes

- **Auth is a shared access code** (Kajabi-style simplicity, no backend). Fine for launch with an access code delivered by the post-purchase email. When sales volume justifies it, upgrade to per-member logins via Memberstack/Outseta or move onto GHL memberships — the content structure here maps 1-to-1.
- Progress tracking is per-device (localStorage).
- Drive links are never shown to members — videos play inside the branded player, so the content reads as proprietary.
- Keep the Drive files set to **Viewer** (not Editor), and disable "Viewers can download" in Share → Settings for extra protection.
