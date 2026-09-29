/* ============================================================
   HANNAH GOLDY  Orlando personal training
   ANGEL: edit this file only. Nothing else needs touching.
   ============================================================ */
window.HG_CONFIG = {

  // 1. BOOKING LINK  where "Book a call" sends people.
  //    GHL: Calendars > your calendar > Share > copy the scheduling link.
  //    Leave empty and the buttons fall back to the enquiry form below.
  BOOKING_URL: "",

  // 2. Where enquiry-form submissions go. "/api/lead" is the built-in function in
  //    api/lead.js: it emails each lead to Hannah. It needs RESEND_API_KEY and
  //    LEAD_TO_EMAIL set in Vercel (see HANDOVER.md). If sending fails, the visitor
  //    gets an email-link fallback instead of a false "sent".
  LEAD_ENDPOINT: "/api/lead",

  // 3. Direct contact. Leave a field empty to hide that button.
  PHONE: "",                                  // e.g. "+14075551234"  enables call + text buttons
  EMAIL: "hannahgoldy@hannahgoldy.com",

  // 4. Service area shown in copy and in the local-business schema.
  CITY: "Orlando",
  REGION: "FL",

  SOURCE_TAG: "orlando-pt",

  // 5. The program: where "The Goldy Standard" links from the home page and from the
  //    "spots full" message. Switch to https://thegoldystandard.com once it's bought.
  PROGRAM_URL: "https://gold-standard-prelaunch.vercel.app",
  //    One line under the program on the home page. Update it on launch day.
  PROGRAM_NOTE: "Opening Soon: The first 100 members get early access pricing.",

  // 6. Set to true when Hannah can't take more one-on-one clients. The home page and the
  //    training page then say her spots are full, offer the waitlist, and point people to
  //    the program, where members can add private coaching calls. Set back to false to reopen.
  ONE_ON_ONE_FULL: false
};
