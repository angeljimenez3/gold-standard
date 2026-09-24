# Build from the Sept 22 call with Hannah

Everything Hannah asked for on the Sept 22 resync, built and tested.
Source call: https://app.fireflies.ai/view/01M35473GASSVHV0GKFWHY51YY

---

## The domain answer she is waiting on

She believed "The Goldie Standard" was available. It is not.

| Domain | Status |
|---|---|
| thegoldiestandard.com | Registered 2009, GoDaddy, held through 2027 |
| goldiestandard.com | Registered 2011, GoDaddy, held through 2027 |
| thegoldstandard.com | Registered |
| goldystandard.com | Available (worth buying too, to redirect typos) |
| **thegoldystandard.com** | **Available: the program's domain** |
| **hannahgoldy.com** | **Available: the Orlando training domain** |
| goldystandardfitness.com | Available |

**Decision (Hannah, Sept 23):** the program is renamed **The Goldy Standard**, at
`thegoldystandard.com`. Everything has been renamed: both new sites, the sales page, the
members area, the course PDFs, the story graphics and the emails. The GS logo still
fits. The one thing that can't change is the audio: the filmed videos say "the gold
standard" out loud. Hannah knew that when she chose the new name (she raised it herself
on the Sept 22 call), so it's accepted.

Also buy `goldystandard.com` and point it at the same site. It costs about twelve dollars
and catches anyone who leaves off the "the".

`hannahgoldy.com` covers the second business. A program sold to strangers should be
named for the promise. A local service where someone is buying her time should be
named for her, because that is what a person remembers after meeting her at a gym.

---

## What was built

### 1. Pre-launch teaser page: `prelaunch/`

The cover site she wanted to post on Instagram now. Mobile first, since effectively
all traffic arrives from a story link.

Flow: visitor lands, picks which of the three tracks they want, and that reveals the
email capture with the founding offer. The poll answer is stored with the lead, which
gives her the read on which program would sell best that she said she was curious
about.

Founding offer on the page: first 100 members at $197 instead of $297.

Safety behavior worth knowing: if the lead endpoint is missing, unreachable or returns
an error, the page does not show a false success. It hands the visitor a prefilled
email link instead. This is tested.

One gap nothing on the page can close: GoHighLevel answers HTTP 200 with
`"Success: test request received"` even for a webhook ID that does not exist (checked
Sept 23 against a made-up ID). A typo in the webhook URL would show visitors the
"You're in" screen while every lead vanishes. That is why the live test in the
checklist below is required, not optional. GHL does accept browser posts from any
origin (its CORS preflight returns `Access-Control-Allow-Origin: *`), so no proxy is
needed.

Total page weight: 952 KB including photos.

### 2. hannahgoldy.com: home page + personal training (`training/`)

Hannah's call (Sept 23): hannahgoldy.com is the front door for everything. The home page
(`training/index.html`) opens with "Hi, I'm Hannah. What are you here for?" and offers
two paths: **Personal Training** (`/training`) and **The Goldy Standard** program. Her
reasoning covers the "local only" worry: personal training works remotely too, and the
page shows no prices, so anyone can see it.

Two settings in `training/config.js` drive this:

- `PROGRAM_URL` / `PROGRAM_NOTE`: where "The Goldy Standard" goes and the line under it.
  Point it at `https://thegoldystandard.com` once bought, and update the note on launch day.
  Keep owning thegoldystandard.com: it's the brand, and Hannah wants the name for future
  products (her example: Goldy Standard protein).
- `ONE_ON_ONE_FULL`: flip to `true` when she can't take more one-on-one clients. Both
  pages then say her spots are full, turn the button into "Join The Waitlist", and point
  people to the program, where members can buy private coaching calls. This is the
  overflow path Hannah described. Flip back to `false` to reopen.

The business card QR goes straight to `/training` (it's her personal training card), while
the printed URL, hannahgoldy.com, lands on the home page.

#### The personal training page (`/training`)

The separate site for her local and remote coaching, kept off her Instagram as she
asked.

Three services, the three Hannah named on the call: one-on-one training in Orlando,
online coaching, and private jiu-jitsu and MMA. Nutrition is folded into the first two
rather than sold as its own service, since she never offered it separately. Online
coaching describes what she already sells remotely per the Apr 20 call (a custom
program plus a weekly call). No prices anywhere, exactly as agreed on the call, so she can
quote per person and raise her rate when she gets busy. Every call to action goes to
a booking step rather than a checkout.

The headline was first written as direct response: "Get coached by a UFC veteran. Right here in
Orlando." Hannah then asked (Sept 23) for it to feel more personable and less intense,
and not to say it's only for women. It now opens "Hi, I'm Hannah. Let's get you strong."
and speaks to anyone. Includes local business schema markup so she ranks for
Orlando searches before she spends anything on Google Ads.

**Where the leads go.** Every enquiry is emailed straight to Hannah by a small
server function (`training/api/lead.js`, served at `/api/lead`). No CRM needed. The email
is built for her phone: the lead's name and what they want at the top, one-tap "Call"
and "Text" buttons, and the lead's address set as Reply-To so she can just hit reply.
Preview: `marketing/lead-email-preview.html`. Phone number is required on the form. The
function checks every field again on the server, silently drops spam bots through a
hidden honeypot field, and escapes anything a visitor types so no one can inject HTML into
her inbox. If sending fails for any reason, the visitor gets the email-link fallback
instead of a false "sent".

### 3. Instagram story graphics: `brand/export/`

Five ready to post, 1080x1920, already exported as PNG:

- `story-01-coming-soon.png`
- `story-02-pick-your-track.png`
- `story-03-founding-100.png`
- `story-04-why-listen.png`
- `story-05-orlando-training.png`

Text sits inside the safe area so Instagram's own chrome does not cover it. Source
HTML is in `brand/stories/` if any copy needs changing; re-export with the command in
the rebuild section below.

Per Angel's advice on the call, these are the follow-up graphic, not the lead. She
talks to camera first, then posts the graphic so people who skipped the video still
get the summary.

### 4. Business cards: `brand/export/`

`business-card-front.png` and `business-card-back.png`, 1125x675 px, which is
3.5 x 2 inches at 300 dpi with a 0.125 inch bleed. Ready for any printer.

The QR code on the back points to hannahgoldy.com and has been decoded from the final
exported PNG to confirm it scans. Spare QR files in four colorways are in `brand/qr/`.

### 5. Pre-launch email sequence: `marketing/email-sequence.md`

Five emails in her voice, triggered by the teaser signup, with GoHighLevel setup notes
and the exact JSON the form posts. Email 3 branches by track and delivers the
phase-by-phase layout the teaser page promises, taken from the real program data.
Merge fields use GHL's `{{contact.*}}` syntax.

### 6. Message to the editor: `marketing/editor-brief.md`

Settles the payment question and briefs the QC pass. Covers all three mislabeled
videos she named, the missing variations, the song lyrics in the captions, and the
wrong "H Goldie" tag. Also separates out the two items that are Angel's problem rather
than the editor's.

---

## What Angel needs to do

1. Buy `thegoldystandard.com` and `hannahgoldy.com` (and `goldystandard.com` as a redirect).
2. Create `hello@thegoldystandard.com` and `hannah@hannahgoldy.com`. The members area
   now uses `hello@thegoldystandard.com` for support. It used to point at
   `thegoldstandardfitness.com`, a domain nobody owns, so those emails would have bounced.
3. Prelaunch leads: create a GoHighLevel workflow, copy its inbound webhook URL into
   `prelaunch/config.js` under `LEAD_ENDPOINT`. GHL is needed here because this page
   has to store a list and send the five-email sequence automatically.
4. Training leads, straight to Hannah's inbox:
   - Create a free account at resend.com and add `hannahgoldy.com` as a sending domain.
     Resend gives you a few DNS records to paste in wherever the domain is registered.
     Wait until it shows "Verified".
   - Create an API key in Resend.
   - In the Vercel project for `training/`, add three environment variables:
     `RESEND_API_KEY` (the key), `LEAD_TO_EMAIL` (the inbox Hannah actually checks, most
     likely the Gmail she uses for your Zoom calls), and optionally
     `LEAD_FROM_EMAIL` (defaults to `Hannah Goldy Website <leads@hannahgoldy.com>`).
   - Optional: put her booking calendar link and phone number in `training/config.js`
     to turn on the "Book A Call", "Call Me" and "Text Me" buttons.
5. Deploy each folder to its own domain.
6. Build the email sequence from `marketing/email-sequence.md`.
7. **Test both forms live from your phone before Hannah posts anything.** On the
   prelaunch page, confirm the contact lands in GHL with the right track (see the note
   under section 1 for why this cannot be skipped). On the training page, confirm the
   lead email reaches Hannah. If it goes to spam the first time, have her mark it "Not
   spam" once so Gmail learns.
8. Send the editor brief.
9. Fix the members area video enlargement bug on mobile. Hannah reported it at the top
   of the call and it is the one item here that affects paying customers.

Deploy:

How the four Vercel projects are set up (important):

| Project | Folder | How it deploys |
|---|---|---|
| gold-standard (sales page + members) | `site/` | Git push to `main`, or `vercel deploy --prod` from the repo root |
| gold-standard-prelaunch | `prelaunch/` | CLI only, run inside `prelaunch/` |
| hannah-goldy-training (hannahgoldy.com) | `training/` | CLI only, run inside `training/` |
| hannah-launch-kit | `launch-kit/` | CLI only, run inside `launch-kit/` |

The three CLI-only projects are deliberately **not** connected to GitHub. Vercel
auto-connected them when they were created, and the first `git push` then made each one
deploy the whole repo instead of its folder, which took all three sites down (404) until
they were disconnected and redeployed (Sept 24). If you ever reconnect them to Git, set
each project's Root Directory to its folder first.

```bash
cd prelaunch && npx vercel --prod
```

```bash
cd training && npx vercel --prod
```

---

## Preview locally

```bash
cd /Users/AAJR/gold-standard && python3 -m http.server 4501 --directory prelaunch
```

```bash
cd /Users/AAJR/gold-standard && python3 -m http.server 4502 --directory training
```

That serves the page only. The `/api/lead` function runs on Vercel, so locally the form
shows its email-link fallback. That's expected.

## Rebuild the graphics after a copy change

```bash
cd /Users/AAJR/gold-standard/brand/stories && python3 -m http.server 4503
```

```bash
cd /Users/AAJR/gold-standard/brand && for f in 01-coming-soon 02-pick-your-track 03-founding-100 04-why-listen 05-orlando-training; do "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --window-size=1080,1920 --screenshot="export/story-$f.png" --virtual-time-budget=4000 "http://localhost:4503/$f.html"; done
```

Regenerate QR codes after a domain change:

```bash
cd /tmp && npm install qrcode && cd /Users/AAJR/gold-standard && node brand/qr/make-qr.mjs
```

---

## Notes on the assets

The original photos in `site/assets/` are 1 to 2 MB PNGs, about 31 MB in total. Six of
them had Instagram carousel arrows and dots baked in from being screenshotted. Those
are cropped out in `site/assets/clean/`, and web-sized JPEGs for all of them are in
`site/assets/opt/`, which brought the set down to 3.4 MB. The new pages use the
optimized copies. The originals are untouched.

## Where the facts come from

Every claim about Hannah matches the live sales page (last edited Apr 21, the day after
she corrected her credentials) or her own words on a recorded call:

- Black belt, stated as "black belt" with no degree ("just put black belt", Apr 20).
- NASM: one credential, Certified Personal Trainer. Angel pulled NASM on Apr 20 because
  she hadn't finished; Hannah confirmed on Sept 23 that she now has it. Never write "4x"
  (the old brand doc was wrong).
- MMA for twelve years, ten of them as a pro (Hannah, Sept 23). Never "twelve years
  pro". The live sales page said that in eleven places; all corrected.
- Credentials bar, per Hannah's notes doc (Sept 24): UFC Veteran, BJJ Black Belt, NASM
  Certified Personal Trainer, 12+ Years in Combat Sports. "Mom" is out of the bar because
  it's in the intro and her story. Same bar on the teaser, training page and sales page.
- She trains in person in **Orlando and Dallas**, and online anywhere.
- The muscle track is called **Build Muscle** (was "Lean Muscle"). Only display names
  changed: the `lean-muscle` slug, access code, and PDF file names stay the same so
  member progress and signup data are unaffected.
- Site copy on the home, training and program pages is Hannah's own wording from her
  notes doc, with typos fixed only.
- Her son, Odin: 180 to 115 pounds, fighting six months after he was born.
- Hypothyroidism diagnosed at age ten.
- No client results or testimonials yet (she said so on Apr 20), so the copy never
  implies any.
- Program structure (three training days plus an optional Saturday, three four-week
  phases, phase names per track) comes from `tools/pdf/prog-data.mjs`.

## Git

None of this is committed. To commit only the new work, without the untracked members
area, invoice PDF and tooling already sitting in the repo:

```bash
git add prelaunch training brand marketing HANDOVER.md .claude/launch.json site/assets/clean site/assets/opt
```

## Tested

Both pages were checked in a browser at phone and desktop width. The poll, the
validation, the successful submission and the failure fallback were each exercised,
and visibility was checked on the rendered page rather than just the `hidden`
property. That second check is what caught a real bug in the first build: component
styles overrode `hidden`, so a dead "Call" button showed with no phone configured and
the form stayed on screen after a successful submit. Both are fixed. The training
page's booking card was tested in all four setups (no config, phone only, calendar
only, both). No images missing alt text, no tap target under 44 px, heading order
correct. The business card QR was decoded from the final exported print file. Both
domains were re-checked as unregistered on Sept 23.
