/* ============================================================
   THE GOLDY STANDARD — MEMBER AREA CONTENT MANIFEST
   ============================================================
   HOW TO UPLOAD COURSE CONTENT:
   1. Upload the video to Google Drive.
   2. Right-click the file → Share → "Anyone with the link" → Viewer.
   3. Copy the FILE ID from the link:
      https://drive.google.com/file/d/FILE_ID_IS_THIS_PART/view
   4. Paste it into the matching driveId: "" below.
   That's it — the video appears in the player automatically.

   SHARED VIDEOS (S1–S6) are filmed once and shown in all three
   tracks. Paste those IDs once in SHARED below and every track
   picks them up.
   ============================================================ */

const CONFIG = {
  /* Access codes → which tracks they unlock. Change ALL codes before launch.
     Put the matching code in each product's purchase confirmation email. */
  accessCodes: {
    "GOLD2026":      ["fat-loss", "lean-muscle", "fighter"], // all-access (legacy/beta)
    "GOLDFAT26":     ["fat-loss"],
    "GOLDMUSCLE26":  ["lean-muscle"],
    "GOLDFIGHT26":   ["fighter"],
  },
  supportEmail: "hello@thegoldystandard.com",
  /* Group coaching waitlist — swap for a GHL form/calendar link when ready */
  groupWaitlistUrl: "mailto:hello@thegoldystandard.com?subject=Group%20Coaching%20Waitlist",
};

/* ---- Shared videos (filmed once, used in all 3 tracks) ---- */
const SHARED = {
  S1: { title: "Welcome to The Goldy Standard", driveId: "1fFtkqvxG4fwwuI6BGHuXkZQhdXVCaC4P" },
  S2: { title: "Meet Hannah", driveId: "1X-gJNFYCLjwsLwZT4GNAZLUCQ0CHtonr" },
  S3: { title: "The Goldy Standard System and Commitment", driveId: "1B0I4eLDFC8XCwSnYZ5kths7pcl73rvZg" },
  S4: { title: "Choosing Your Weight, Progressing, and Substitutions", driveId: "1zyzKy8ishslH-c8yiy1lzdP1S-GQEM-L" },
  S5: { title: "Warm-Up and Cool-Down System", driveId: "1zP3sh_dlwVZZ7jADNX-GqmJapaEYj8ry" },
  S6: { title: "Mindset, Sleep, Supplements, and Lifestyle", driveId: "15cL9SE9_Zlaxp0zLB-XsNF5KKtkCalML" },
};

/* ---- Helper to build a track's 20-lesson curriculum ---- */
function buildTrack(t) {
  return [
    { module: "Start Here", lessons: [
      { n: 1,  title: SHARED.S1.title, shared: "S1", desc: "Your official welcome. What this program is, how it works, and the commitment you're making to yourself." },
      { n: 2,  title: SHARED.S2.title, shared: "S2", desc: "UFC veteran. BJJ black belt. Mom. Hannah's story and why she built The Goldy Standard." },
      { n: 3,  title: `Welcome to ${t.name}`, driveId: (t.vids||{})[3] || "", desc: t.welcomeDesc },
      { n: 4,  title: SHARED.S3.title, shared: "S3", desc: "The three-track system, the philosophy behind it, and the commitment that makes it work." },
    ]},
    { module: "The Foundations", lessons: [
      { n: 5,  title: `Training Principles for ${t.principles}`, driveId: (t.vids||{})[5] || "", desc: t.principlesDesc },
      { n: 6,  title: t.bigConcept, driveId: (t.vids||{})[6] || "", desc: t.bigConceptDesc },
      { n: 7,  title: t.rules, driveId: (t.vids||{})[7] || "", desc: "Hannah's non-negotiables. Tape them to your bathroom mirror.", res: [{ label: "10 Rules Poster (PDF)", file: `10-rules-${t.slug}.pdf` }] },
      { n: 8,  title: `Your ${t.name} Weekly Split and How to Read the Workouts`, driveId: (t.vids||{})[8] || "", desc: "Your training week, how workouts are written, supersets, circuits, and rest periods.", res: [{ label: "Full 12-Week Program (PDF)", file: t.progFile }, { label: "Weekly Workout Log (PDF)", file: "workout-log.pdf" }] },
      { n: 9,  title: SHARED.S4.title, shared: "S4", desc: "How to pick the right weight, when to increase it, and what to substitute when equipment isn't available.", res: [{ label: "Choosing Weight & Substitutions (PDF)", file: "choosing-weight-substitutions.pdf" }] },
      { n: 10, title: SHARED.S5.title, shared: "S5", desc: "The 4-step warm-up and the full cool-down and recovery system. Don't skip these.", res: [{ label: "Warm-Up & Cool-Down One-Sheet (PDF)", file: "warmup-cooldown-system.pdf" }] },
    ]},
    { module: `Phase 1 — ${t.p1} (Weeks 1–4)`, lessons: [
      { n: 11, title: `Phase 1 Walkthrough: ${t.p1}`, driveId: (t.vids||{})[11] || "", desc: "Everything in your first 4 weeks: the goal, the week structure, and what to focus on." },
    ]},
    { module: `Phase 2 — ${t.p2} (Weeks 5–8)`, lessons: [
      { n: 12, title: `Phase 2 Walkthrough: ${t.p2}`, driveId: (t.vids||{})[12] || "", desc: "Intensity goes up. Here's exactly what changes and how to handle it." },
    ]},
    { module: `Phase 3 — ${t.p3} (Weeks 9–12)`, lessons: [
      { n: 13, title: `Phase 3 Walkthrough: ${t.p3}`, driveId: (t.vids||{})[13] || "", desc: "The final push. Peak intensity, and how to finish the program strong." },
    ]},
    { module: "Nutrition", lessons: [
      { n: 14, title: t.nutrition, driveId: (t.vids||{})[14] || "", desc: "Calories, macros, and exactly how to eat to support your goal.", res: [{ label: "Calorie & Macro Worksheet (PDF)", file: "calorie-macro-worksheet.pdf" }] },
      { n: 15, title: t.nutrition2, driveId: (t.vids||{})[15] || "", desc: "The real-life stuff: snacks, eating out, and staying on track.", res: [{ label: "Eating Guide (PDF)", file: `eating-guide-${t.slug}.pdf` }] },
    ]},
    { module: "Mindset & Beyond", lessons: [
      { n: 16, title: SHARED.S6.title, shared: "S6", desc: "The habits outside the gym that decide your results: sleep, recovery, supplements, and lifestyle.", res: [{ label: "Supplement Guide (PDF)", file: "supplement-guide.pdf" }] },
      { n: 17, title: "Tracking Progress, FAQ, and What's Next", driveId: (t.vids||{})[17] || "", desc: "How to measure real progress, answers to common questions, and your path after the 12 weeks.", res: [{ label: "12-Week Progress Tracker (PDF)", file: "progress-tracker.pdf" }, ...(t.extraRes || [])] },
    ]},
  ];
}

/* ---- The three tracks ---- */
const COURSES = [
  {
    id: "fat-loss",
    name: "Fat Loss Foundation",
    navLabel: "Fat Loss",
    tagline: "Sustainable fat loss through structured training and real-life nutrition.",
    badge: "TRACK 01",
    price: "$297",
    memberPrice: "$178",
    buyUrl: "https://gold-standard-beta.vercel.app/#pricing",
    programPdf: "fat-loss-program.pdf",
    weeks: 12,
    modules: buildTrack({
      name: "Fat Loss Foundation",
      slug: "fat-loss",
      vids: { 3:"1X9GrkdNK5JmJ6DLdXHjbsPuBJTAkyuEb", 5:"1oyg07qYzxlRbcH2rpWbHXSLMLTSby4Jb", 7:"1TXVYwwzzVGseX5wtHup8jHanlfeSVmnl", 6:"1aleaPyQ8kEcA6xuZINXzmC7z9Idk87Ix", 8:"1_V9sDMbOClg07MjJFz0LgM0X9oWh5ofu", 11:"1GvcfEcpXzbTO3aiuv9mlP69x63hD-NJe", 12:"1Kl0detXao66gfYdimU-J_U2V5nqdv78Y", 13:"1rJYvB0olgMY8dKydC9Lw07fOFalhz_hk", 14:"18n8f6POvWDC4d3Wm0C0bk1L920_8_xZe", 15:"1WeLo8KXn2ss7zOgCqqS1xyfzRfaTKUD2", 17:"1yPNHNpsMussf49kqe9ar-Lymfq0aHUMN" },
      progFile: "fat-loss-program.pdf",
      extraRes: [{ label: "Plateau Troubleshooting (PDF)", file: "plateau-troubleshooting.pdf" }],
      welcomeDesc: "What this track delivers, who it's for, and the transformation ahead.",
      principles: "Fat Loss",
      principlesDesc: "Why strength + conditioning beats cardio-only, and how this program creates fat loss.",
      bigConcept: "The Big Concept: Understanding the Calorie Deficit",
      bigConceptDesc: "The one principle that decides fat loss. Master this and everything else makes sense.",
      rules: "Hannah's 10 Fat Loss Rules",
      p1: "Build the Foundation", p2: "Build Momentum", p3: "Peak Performance",
      nutrition: "Calories, Macros, and How to Eat for Fat Loss",
      nutrition2: "Snacks, Eating Out, and Cravings",
    }),
  },
  {
    id: "lean-muscle",
    name: "Build Muscle",
    navLabel: "Build Muscle",
    tagline: "Build lean muscle and real strength with progressive overload.",
    badge: "TRACK 02",
    price: "$297",
    memberPrice: "$178",
    buyUrl: "https://gold-standard-beta.vercel.app/#pricing",
    programPdf: "lean-muscle-program.pdf",
    weeks: 12,
    modules: buildTrack({
      name: "Build Muscle",
      slug: "lean-muscle",
      vids: { 3:"14hsieD40MrQ758HTiQE2zON_-s_Ru4qn", 5:"1GFUqqRiVxe3xknZ8zpaeyJTyMDVzs3QL", 6:"1VR8FOpy6wtWDOo7sLoFKlcFk6pxw1hr3", 7:"1mYFUzLwPyl0M-UWJ2OXCTN6cuMgShdRj", 8:"1JNWHvwqoKTESCMqGKebwAztS7kobUnfs", 11:"1FUmJQlxwA-pj5hAzTTKmdMWbRPcNNIQX", 12:"1RyIL_znbYJltSxzr5aotlgfPHNq-JUF7", 13:"14Mc7eaUsPzlztpaLaDAeDXy_BF4wI5JT", 14:"1qof9hIJGqF3oyZfGJY05Yr9Druze1jK5", 15:"1QLwFCLDVcmQ7Ql8jFTOZaI3wvaMjhEm3", 17:"1UVz9tKL-Mcrmy5vmaKOJvEPj8on7HXK-" },
      progFile: "lean-muscle-program.pdf",
      welcomeDesc: "What this track delivers and how you'll build muscle over the next 12 weeks.",
      principles: "Building Muscle",
      principlesDesc: "Progressive overload, hypertrophy, and the training stimulus that builds muscle.",
      bigConcept: "The Big Concept: How to Build Muscle Without Gaining Excess Fat",
      bigConceptDesc: "The controlled surplus: eat enough to grow without the excess fat.",
      rules: "Hannah's 10 Rules for Building Lean Muscle",
      p1: "Muscle Foundation", p2: "Progressive Overload", p3: "Strength and Muscle Peak",
      nutrition: "Calories, Macros, and How to Eat for Lean Muscle",
      nutrition2: "Snacks, Eating Out, and Cardio While Building Muscle",
    }),
  },
  {
    id: "fighter",
    name: "Fighter Conditioning",
    navLabel: "Fighter",
    tagline: "Train like a fighter. Strength, explosiveness, and elite conditioning.",
    badge: "TRACK 03",
    price: "$297",
    memberPrice: "$178",
    buyUrl: "https://gold-standard-beta.vercel.app/#pricing",
    programPdf: "fighter-conditioning-program.pdf",
    weeks: 12,
    modules: buildTrack({
      name: "Fighter Conditioning",
      slug: "fighter",
      vids: { 3:"1L3f8YsugN1LR18hxnw9ULWQsGoAlgM3R", 5:"1g7ibQfA0GK1uvHoBCefvsOKwH6xQdXW2", 7:"1wTub3XKck0ZjBNvDpVXIzAKy1HYicBqe", 6:"1ib3IwiW_xhE3xNQ7Cq_uJBrwOlO5lg8N", 8:"1Cxyly7FW0Gk_Igpmbb3vcJOGXIRGRBzg", 11:"1lGmLgxYV07t3R8vwFyzGjvd_lSLa8-8-", 12:"1dZHmLPTDFWi84yvjm0dW_yglf6V6yEzx", 13:"1JZhsnxpa8WiT8W-GOq0cbPp_hHnnTJdo", 14:"1wtsaXmGHEVYry1IdNDbAfn46V2_kA1-l", 15:"1uRIERa7GpGWzRvS_0-w7MfFzDD7P67Fn", 17:"1xaLyZ6mWIjL7Flc8FAzLsUU2QByaZnwk" },
      progFile: "fighter-conditioning-program.pdf",
      welcomeDesc: "The track built from real fight camps. Explosive power, endurance, and mental toughness.",
      principles: "Fighter Conditioning",
      principlesDesc: "How fighters actually train: strength, explosive power, conditioning, and core.",
      bigConcept: "The Big Concept: The Energy Systems Behind Conditioning",
      bigConceptDesc: "Aerobic, anaerobic, and explosive power — and how this program trains all three.",
      rules: "Hannah's 10 Rules for Training Like a Fighter",
      p1: "Conditioning Foundation", p2: "Power and Endurance", p3: "Elite Fighter Conditioning",
      nutrition: "Calories, Macros, and How to Eat for Performance",
      nutrition2: "Snacks, Hydration Strategy, and Recovery Nutrition",
    }),
  },
];

/* ---- Exercise Demo Library ----
   Every movement used across the three programs.
   Same upload process: paste the Drive file ID. */
const EXERCISE_LIBRARY = [
  /* Legs */
  { name: "Back Squat", cat: "Legs", driveId: "10bzN7yVTNfhpxLE45FZ-H0jl8Gr3CRXm" },
  { name: "Front Squat", cat: "Legs", driveId: "1NuJJRzaq1-RWxRFpghhNbpmqyyo7tsj6" },
  { name: "Goblet Squat", cat: "Legs", driveId: "12vwCpxBoIU7DLkA-tkIgvYCS4-tH6jdz" },
  { name: "Bulgarian Split Squat", cat: "Legs", driveId: "1Rd68kIbGt4994I8gwxHSkqB-JPlwM6FC" },
  { name: "Romanian Deadlift", cat: "Legs", driveId: "1Oe_kCiq0a6_kYrbSdXa4uNpstYJjkLEw" },
  { name: "Barbell Deadlift", cat: "Legs", driveId: "1e2sKcZrfqoj7x0QkKMDCuYDhgMv0bXPb" },
  { name: "Single Leg RDL", cat: "Legs", driveId: "1TE9ZOTxUStlkEnTn0GpoSF0eG394xwoH" },
  { name: "Walking Lunges", cat: "Legs", driveId: "1FJ_UP98Hl_qSk16CxicXFbMiHi1WvKvK" },
  { name: "Step Ups", cat: "Legs", driveId: "1jZoI1-ws1K3JYIT3p5-ZdWT2IXorRtZX" },
  { name: "Split Jump Lunges", cat: "Legs", driveId: "1aUwgsHdDHuNKmoa5kjW3FY9VZo_n4sK8" },
  { name: "Jump Squats", cat: "Legs", driveId: "1LZsJ2D3ETxC5MA4QrtDtXnwPux5ZcJur" },
  { name: "Hip Thrust", cat: "Legs", driveId: "1Ol-FEaHYSfh284ftpKOO5hgWZx2CSsSA" },
  { name: "Single Leg Glute Bridges", cat: "Legs", driveId: "1Q9VAEgusSGsLsC6gPKgzqrL16KqytSaO" },
  { name: "Leg Press", cat: "Legs", driveId: "1bKXSQrv2mxlmisELHpXQLpzCce-8c8II" },
  { name: "Leg Curl", cat: "Legs", driveId: "" },
  { name: "Leg Extension", cat: "Legs", driveId: "1kOxopqIZamWUnDGPFG6BmjrdiX8U5tPH" },
  { name: "Single Leg Curl", cat: "Legs", driveId: "14v8BBCCzH9NT_ewKgH_GJFYSIgLuj5bt" },
  { name: "Single Leg Curl (Tempo)", cat: "Legs", driveId: "1DxkgSFaz2ANE306rL-6wkHuabTZK4yeK" },
  { name: "Single Leg Extension", cat: "Legs", driveId: "1kjn9Nda0_hRBsSWYpKC4WIE8DsMca3hW" },
  { name: "Standing Calf Raises", cat: "Legs", driveId: "10V9rfm0ZaSC3CvunBqDd-r4nM-4a3FLI" },
  { name: "Box Jump", cat: "Legs", driveId: "1Yw7ZGp0y7afoyEvG1fFgMmWTzFGsRmfF" },
  { name: "Seated Box Jump", cat: "Legs", driveId: "12x5LHaNuvinaiwYfrdjnD9rIvvwlsksD" },
  /* Push */
  { name: "Bench Press", cat: "Push", driveId: "1jcKsDuLvzvPZsKTUVnOdvE1VUYJUSH0o" },
  { name: "Dumbbell Bench Press", cat: "Push", driveId: "1NC1ZriBtm8kwnj6agHNlckew_cedd_fA" },
  { name: "Incline Dumbbell Bench", cat: "Push", driveId: "1ZfnuTnI_YhQwr1HYrqmiNQI3thkMKWRm" },
  { name: "Dumbbell Shoulder Press", cat: "Push", driveId: "1Ka4kQSlcdNakw2qbq6b4uBNZtRrQYMFH" },
  { name: "Single Arm DB Shoulder Press", cat: "Push", driveId: "1tu6m8Q-sv2J8_KPpW9H7L5MZKsBfs63Z" },
  { name: "Standing Single Arm Shoulder Press", cat: "Push", driveId: "1ZppUrQMIwrjaX8g0nIMlwM1JYn1LeTTg" },
  { name: "Barbell Push Press", cat: "Push", driveId: "15QaiNuUjePrPM7piZqTZ568Z78WJ5nEZ" },
  { name: "Dumbbell Push Press", cat: "Push", driveId: "" },
  { name: "Pushups", cat: "Push", driveId: "1FlUOsG1fazTinrwaP5whQAuAyFfacEzT" },
  { name: "Hand Release Pushups", cat: "Push", driveId: "1x6XM_U2E0vtftsIEF6_y7af-CFT3nf3t" },
  { name: "Dips", cat: "Push", driveId: "12zPUKgQTCUmiXmWmaqUa3nLy0VqY7-cE" },
  { name: "Tricep Rope Pushdown", cat: "Push", driveId: "1BoAtlhWevceWIjZceMbCTy15KJheG-qE" },
  { name: "Tricep Dumbbell Extension", cat: "Push", driveId: "18xc7yY6STLdEBmf_UaxRrxEZniAKnrX5" },
  { name: "Cable Fly", cat: "Push", driveId: "17hclxa-Hsehox8q1owKJU2Q-Q_0NPfq5" },
  /* Pull */
  { name: "Pull Ups (+ Band Assisted)", cat: "Pull", driveId: "1cgHrV8A2VGWnwTgcJlCubNXOw6zx1FFD" },
  { name: "Lat Pulldown", cat: "Pull", driveId: "1rJ4gUMzO2WRyF-F_--aGGjJAk2rvq1mO" },
  { name: "Seated Cable Row", cat: "Pull", driveId: "1eKmIbZf-LaGNy9CS8NpQzVRQIwGBmBeo" },
  { name: "Bent Over Barbell Row", cat: "Pull", driveId: "12MAtq_2Fbj0qZ9JVrcMYv6TkcaVWga7X" },
  { name: "Single Arm Dumbbell Row", cat: "Pull", driveId: "1OoalqaZ35MH_ondgQNxkqeQMiiUdakIW" },
  { name: "Renegade Row", cat: "Pull", driveId: "1EdzV-L3s_S8CDe_38UDZSc70wimZ2Hbi" },
  { name: "Bicep Curl", cat: "Pull", driveId: "1BrOJ-EmIdH3rgDt9HoiCZrDZdfNEoIcp" },
  { name: "Hammer Curl", cat: "Pull", driveId: "1rf93J9kpt4HqwMaFu4CpOeOSLD-zBrFG" },
  /* Shoulders */
  { name: "Lateral Raises", cat: "Shoulders", driveId: "1xvvsu3s-WUU3N19pJhIzA_aDin-RVVLS" },
  { name: "Front Raises", cat: "Shoulders", driveId: "1b-JSCVHucxFHX4Hg_xf1yYUTqvYRwTAf" },
  { name: "Rear Delt Fly", cat: "Shoulders", driveId: "1gIPgQftqTy2Cs40kM-gXD6_v7KMNs4Wv" },
  { name: "Band Pull Aparts", cat: "Shoulders", driveId: "1y4mL3jJU939SYJ2qkD1Jt8FnZEXM93om" },
  /* Power */
  { name: "Barbell Hanging Power Clean and Press", cat: "Power", driveId: "1H9mCE2e_C_IWYMnOE91QDtvCue-wZurB" },
  { name: "Hanging Squat Clean", cat: "Power", driveId: "1iv_7ORdYdRdgPC5KMSnOMIXbSU-0_yeB" },
  { name: "Squat Clean from Floor", cat: "Power", driveId: "14UcwVRzMEZuKaS9klHWioQnnGcaMK_0k" },
  { name: "Dumbbell Snatch (Single Arm)", cat: "Power", driveId: "1hHHuqlQN1mPV1OjwOU6ZkC0rWdmvd7b2" },
  { name: "Kettlebell Swing", cat: "Power", driveId: "1eUkYJ13MiODGFmb4Q-BU9zNqNb46M_IA" },
  { name: "Medicine Ball Slam", cat: "Power", driveId: "1Cvs6Lt4aBuo56RSdax3RYcjd5qW87Khe" },
  { name: "Rotational Medball Throw", cat: "Power", driveId: "19FPW5s1TiFTvWzUgmpW99MpI05lSRvDx" },
  { name: "Dumbbell Thruster", cat: "Power", driveId: "1j4xyL7TlcMSmMHhnCpu-0mVZ4KY2Pde2" },
  { name: "Barbell Thruster", cat: "Power", driveId: "1pbtprLJN2itLOrwlzvFiZfCUHdGJuyZ-" },
  { name: "Burpees", cat: "Power", driveId: "1nzQD0_IUV1T4Qw3_YSbmVTFaGhaJx5Lm" },
  { name: "Burpee Pushup", cat: "Power", driveId: "1AGSY2x8voSjpHSvSQwni22OelluY_QQm" },
  /* Core */
  { name: "Plank", cat: "Core", driveId: "1N92pndJF0McFOJoVAHsOkwp7JD6WpvmL" },
  { name: "Weighted Plank", cat: "Core", driveId: "1rmxrPLN503BMkjAuUjL_9N1EY8AoFXwo" },
  { name: "Hanging Knee Raises", cat: "Core", driveId: "1CFlq-BOnrx90WQJVCf8Gdic4y9fbw5Ah" },
  { name: "Hanging Leg Raises", cat: "Core", driveId: "1oaPG4wz75JwFKaffJYaeCHUlrCNZiGDm" },
  { name: "Dead Bug", cat: "Core", driveId: "1z0pk052PaNRDVOAtRggJKp_q-seBjIcS" },
  { name: "Weighted Russian Twist", cat: "Core", driveId: "1NXLTTMzOG9kMNubteLG_v1c8nxhZZ8n2" },
  { name: "Landmine Rotation", cat: "Core", driveId: "1AfAJ5n9TcQr2Rd9L4N19tgLRD0kb5Y0V" },
  { name: "Mountain Climbers", cat: "Core", driveId: "1Nig5Oi6XyF8Xwmkyj-NOPd9naB7SN2iE" },
  { name: "Pushup Sit-Outs", cat: "Core", driveId: "1roBIhgG3NKc0yRlOF0zwgxgoEyuTz9-r" },
  /* Conditioning */
  { name: "Battle Ropes", cat: "Conditioning", driveId: "1nznb-RE4W46g5u1sGGDODcP4rxQvvda7" },
  { name: "Farmers Carry", cat: "Conditioning", driveId: "16tV1HzYcGqROYeLXZlY2aV86PDhKpJK2" },
  { name: "Air Bike Intervals", cat: "Conditioning", driveId: "1lbgljy2D_NVUcg_sRMOMHs3CoXSNIwh8" },
  { name: "Rower Technique", cat: "Conditioning", driveId: "1ltEsKA7pb_A_GbVvUG_e6Qs6RmNg-M2A" },
  { name: "Sled Push", cat: "Conditioning", driveId: "1GS29JHfM4vLokMsKI6tsIFfYAXAZXnnR" },
];

/* ---- Coaching upsells (shown on dashboard + after Phase 3) ---- */
const COACHING = [
  { name: "1-on-1 Coaching — 2 Calls", price: "$1,250", desc: "Two private video calls with Hannah. Personalized answers for your exact situation.", cta: "Apply Now" },
  { name: "1-on-1 Coaching — 4 Calls", price: "$2,500", desc: "Four private calls across your 12 weeks. Check-ins, adjustments, and accountability.", cta: "Apply Now", featured: true },
  { name: "Group Coaching Intensive", price: "$3,000", desc: "8-week advanced intensive with group calls, all specialties covered.", cta: "Join Waitlist" },
];
