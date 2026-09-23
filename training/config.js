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
  EMAIL: "hannah@hannahgoldy.com",

  // 4. Service area shown in copy and in the local-business schema.
  CITY: "Orlando",
  REGION: "FL",

  SOURCE_TAG: "orlando-pt"
};
