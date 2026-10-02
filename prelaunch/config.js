/* ============================================================
   THE GOLDY STANDARD  Pre-launch config
   ANGEL: this is the only file you need to edit before deploy.
   ============================================================ */
window.GS_CONFIG = {

  // 1. WHERE LEADS GO.
  //    Our own endpoint on hannahgoldy.com. Signups are saved privately and show on
  //    hannahgoldy.com/admin (founding list count, which program they picked).
  //    Leave empty and the form falls back to an email link so no lead is lost.
  LEAD_ENDPOINT: "https://hannahgoldy.com/api/signup",

  // 2. Fallback address used if LEAD_ENDPOINT is empty or the POST fails.
  FALLBACK_EMAIL: "thegoldystandard@hannahgoldy.com",

  // 3. Founding offer shown on the page.
  FOUNDING_SPOTS: 100,
  FOUNDING_PRICE: 197,
  FULL_PRICE: 297,

  // 4. Set a launch date to show the countdown. Format: "YYYY-MM-DDTHH:MM:SS".
  //    Leave empty to hide the countdown entirely.
  LAUNCH_DATE: "",

  // 5. Where the GS logo goes: Hannah's home page.
  HOME_URL: "https://hannahgoldy.com",

  // 6. Tag every lead from this page (useful once you run more than one source).
  SOURCE_TAG: "prelaunch-teaser",

  // 7. LAUNCH SWITCH. false = founding list (email form). true = people pay through Stripe
  //    for the track they pick ($197 for the first 100 sales, then $297; counted on the server).
  //    Preview the launch version any time by adding ?sales=preview to the page address.
  SALES_OPEN: false,
  CHECKOUT_ENDPOINT: "https://hannahgoldy.com/api/checkout"
};
