# Pre-launch email sequence

Five emails that go out automatically after someone signs up on the teaser page.
Written in Hannah's voice: first person, direct, no filler.

Send from: thegoldystandard@hannahgoldy.com (display name "Hannah Goldy")

Every factual claim below is taken from the live sales page (`site/index.html`), the
program data (`tools/pdf/prog-data.mjs`) or Hannah's own words on recorded calls.
If you edit these, keep it that way. Two specifics: she holds one NASM credential,
Certified Personal Trainer (confirmed by Hannah on Sept 23), so never write "4x NASM".
And do not imply she has client results yet (she said on the Apr 20 call that she
does not). She has done MMA for twelve years, ten of them as a pro.

## Merge fields (GoHighLevel syntax)

- `{{contact.first_name}}`: standard GHL field.
- `{{contact.gs_track}}`: a custom field. Create it in GHL as a single-line text field
  named "GS Track" (GHL will give it the key `gs_track`; if it gives a different key,
  swap it in below). The teaser form already sends the display name as `trackLabel`
  ("Fat Loss", "Build Muscle" or "Fighter Conditioning"), so map `trackLabel` straight
  into this field with no conversion.

Timing assumes launch is roughly two weeks after the first signups. Shift the gaps if
the date moves.

---

## Email 1: sends immediately

**Subject:** You're in, {{contact.first_name}}

**Preview text:** Your founding spot is held. Here's what happens next.

Hey {{contact.first_name}},

You're on the founding list. When The Goldy Standard opens, you get the full twelve-week
program for $197 instead of $297, and you get in before it goes public.

You picked {{contact.gs_track}}. In a few days I'll send you exactly how that track is
laid out, phase by phase, so you know what you are signing up for before you pay a
cent.

Before that, I want to tell you why I built this at all. That's the next email.

If you want to follow along in the meantime, I'm at @hannahgoldy on Instagram.

Hannah

---

## Email 2: sends 2 days after signup

**Subject:** 180 pounds and a thyroid that wouldn't cooperate

**Preview text:** The part nobody puts in the before-and-after post.

{{contact.first_name}},

Here's the part people leave out of the transformation posts.

I was diagnosed with hypothyroidism when I was ten. It has made every pound harder to
lose than it should be, my whole life. I've still spent twelve years in MMA, ten
of them as a pro, and fought in the UFC.

After I had my son I was 180 pounds. I got down to 115 and fought six months later.

There was no trick to it. There was a system I had put together over twelve years of
fighting, most of it learned the hard way, by doing things that did not
work until I found the things that did.

The Goldy Standard is that system. It is the thing I wish somebody had handed me at the
start.

If your body has ever felt like it does not respond the way everyone promises it will,
I understand that. It is the whole reason I made this.

Next email: what is actually inside it.

Hannah

---

## Email 3: sends 5 days after signup

This is the email the teaser page promises ("I'll send you how that track is laid out,
phase by phase"), so it has to go out. Build it as one email with an If/Else branch on
the track: the shared opening and closing go to everyone, and each person gets the one
track block that matches their answer.

**Subject:** Your {{contact.gs_track}} plan, week by week

**Preview text:** Three phases, three training days a week, and what changes in each.

{{contact.first_name}},

I promised you the layout of your track before anyone else sees it. Here it is.

Twelve weeks, split into three four-week phases that build on each other. You train
three days a week, Monday, Wednesday and Friday, with an optional fourth session on
Saturday.

**[IF track = Fat Loss]**

Your track is Fat Loss Foundation. The goal is sustainable fat loss through structured
training, better conditioning and habits you can keep.

Weeks 1 to 4, Build the Foundation. Moderate weights, controlled tempo, and getting
your movement right before we push it.

Weeks 5 to 8, Build Momentum. The weights go up a little, the rest periods get
shorter, and there is more metabolic work.

Weeks 9 to 12, Peak Performance. Higher intensity. The workouts get more athletic and
more demanding.

Monday is lower body and conditioning, Wednesday is upper body and conditioning, Friday
is full body strength with metabolic work, and Saturday is optional cardio.

**[IF track = Build Muscle]**

Your track is Build Muscle. It is built on progressive overload, strength
work and hypertrophy, with longer rest periods so you can lift heavier.

Weeks 1 to 4, Muscle Foundation. You build your strength base and your movement
quality.

Weeks 5 to 8, Progressive Overload. More strength, more volume.

Weeks 9 to 12, Strength and Muscle Peak. This is where the program pushes hardest for
strength and growth.

Monday is lower body strength, Wednesday is upper body strength, Friday is hypertrophy
and accessories, and Saturday is optional recovery cardio.

**[IF track = Fighter Conditioning]**

Your track is Fighter Conditioning. Fighters train differently. The point is not just
building muscle or losing fat, it is a body that is strong, explosive and conditioned,
and that holds up under pressure.

Weeks 1 to 4, Conditioning Foundation. You build baseline endurance and learn how
fighters condition.

Weeks 5 to 8, Power and Endurance. More explosiveness and more work capacity.

Weeks 9 to 12, Elite Fighter Conditioning. Everything goes up: endurance,
explosiveness, conditioning.

Monday is strength and power, Wednesday is conditioning rounds, Friday is a fighter
circuit, and Saturday is optional conditioning.

**[END IF]**

Around the training there is a filmed demo library, so when you get to the rack and
are not sure your setup is right, you pull up the video on your phone and check.

Nutrition is built on your own numbers: how to set your macros, full meal plans and
day-of-eating breakdowns, and how to eat out on a Friday night without wrecking your
week.

And there is the part most programs skip: what to do when you plateau, how to swap an
exercise when your gym does not have the equipment, and a tracker so you can see
whether it is working.

Hannah

---

## Email 4: sends 8 days after signup

**Subject:** "It's easy for you"

**Preview text:** I get this one a lot. Here's my honest answer.

{{contact.first_name}},

I get told this a lot: it is easy for you, you are an athlete.

It was not easy. I have had a thyroid condition since I was ten. Training for a living
gave me more time than most people have, and I still spent years on things that did not
work because nobody told me otherwise. Having time is not the same as knowing what to
do with it.

Underneath that one I usually hear two other worries. I do not have the time, and I
cannot eat the food I like.

On time: the program is three training days a week, Monday, Wednesday and Friday, plus
an optional Saturday. Not six days.

On food: the nutrition section is built around your numbers, and it includes how to eat
out without undoing your week. You learn to fit food you like into the plan instead of
cutting it out.

If you have been putting this off because you think you need a perfect schedule and
perfect discipline, you do not. You need a plan that survives an imperfect week.

Hannah

---

## Email 5: sends launch day

**Subject:** Doors are open, {{contact.first_name}}

**Preview text:** Your founding price is live. First 100 only.

{{contact.first_name}},

The Goldy Standard is open.

You are on the founding list, so your price is $197 instead of $297. That price is for
the first 100 people. After that it goes to full price.

Here is your link: [FOUNDING CHECKOUT LINK]

You picked {{contact.gs_track}}, and that is the track waiting for you when you log in.

Twelve weeks from now you could be in the best shape of your life. The only part I
cannot do for you is start.

Hannah

---

## Setup notes for Angel

Build this in GoHighLevel as a workflow triggered by the inbound webhook the teaser form
posts to.

1. Create the workflow and copy its inbound webhook URL into `prelaunch/config.js`
   under `LEAD_ENDPOINT`.
2. The form posts this JSON:
   `{ firstName, email, track, trackLabel, source, submittedAt }`
   `track` is a slug (`fat-loss`, `lean-muscle`, `fighter`), handy for tags and
   branching. `trackLabel` is the display name, for the `gs_track` field.
3. Map `firstName` to first name, `email` to email and `trackLabel` to the GS Track
   custom field.
4. Tag every contact `founding-list` plus their track slug. Branch email 3 on that tag.
5. Email 5 needs the real checkout link before it sends. It is the only placeholder in
   the sequence.

**Test before sharing the link (this is required).** GoHighLevel returns HTTP 200 with
`{"status":"Success: test request received"}` even for a webhook ID that does not
exist. We checked this on Sept 23 by posting to a made-up ID. So a single wrong
character in the webhook URL means visitors see the "You're in" screen while every lead
disappears, and nothing on the page can detect it. After deploying, sign up once
yourself from your phone and confirm the contact shows up in GHL with the right track
before Hannah posts the link.

The poll answers are the most useful data this produces. Hannah said on the call she
wants to know which program would do best. Pull the track counts before deciding which
track leads the launch.
