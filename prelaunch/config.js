/* ============================================================
   THE GOLDY STANDARD  Pre-launch config
   ANGEL: this is the only file you need to edit before deploy.
   ============================================================ */
window.GS_CONFIG = {

  // 1. WHERE LEADS GO.
  //    Paste your GoHighLevel inbound webhook URL here.
  //    GHL: Automation > Workflows > new workflow > Inbound Webhook trigger > copy URL.
  //    Leave empty and the form falls back to an email link so no lead is lost.
  LEAD_ENDPOINT: "",

  // 2. Fallback address used if LEAD_ENDPOINT is empty or the POST fails.
  FALLBACK_EMAIL: "hello@thegoldystandard.com",

  // 3. Founding offer shown on the page.
  FOUNDING_SPOTS: 100,
  FOUNDING_PRICE: 197,
  FULL_PRICE: 297,

  // 4. Set a launch date to show the countdown. Format: "YYYY-MM-DDTHH:MM:SS".
  //    Leave empty to hide the countdown entirely.
  LAUNCH_DATE: "",

  // 5. Tag every lead from this page (useful once you run more than one source).
  SOURCE_TAG: "prelaunch-teaser"
};
