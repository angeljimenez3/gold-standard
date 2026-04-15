# Phase 4: Website Build Brief — The Gold Standard by Hannah Goldy

## Design Direction

### Color Palette (from brand book, refined)
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary BG | Deep Navy | #1C2B3A | Hero, nav, dark sections |
| Accent | Light Gold | #E8C96A | CTAs, highlights, borders, hover states |
| Clean BG | Off-White | #F5F4F0 | Light sections, body background |
| Support | Matte Gold | #A8872A | Gold on light backgrounds, secondary buttons |
| Dark Overlay | Near Black | #111827 | Overlays, footer |
| Mid Panels | Navy Mid | #2F4259 | Cards, secondary panels |

### Typography
| Font | Role | Source |
|------|------|--------|
| **Anton** | H1, hero headline, section titles | Google Fonts |
| **Bebas Neue** | Eyebrows, labels, callouts, caps | Google Fonts |
| **Inter** | Body copy, captions, buttons, UI | Google Fonts |

### Photography / Asset Style
- High-energy athletic imagery of Hannah (training, fighting, lifestyle)
- Images sourced from: https://drive.google.com/drive/folders/1b70HTjTYpbI6w4ulRiT0YYVsPS8KbpGn
- Image placeholders will be clearly marked with dimensions and descriptions
- 3D scroll asset placeholder in hero section for future scroll-stop video

### Animation Recommendations
- **GSAP + ScrollTrigger** for all scroll-triggered animations
- Section fade-in/slide-up reveals
- Parallax depth on background images
- Counter animations on credential stats (12 years, 4 certs, etc.)
- Smooth hover states on buttons and cards (gold shimmer effect)
- `prefers-reduced-motion` support — all animations disabled for accessibility
- Dark/light section alternation creates visual rhythm

### What to AVOID
- Emojis in any copy or UI
- Aggressive clashing colors (competitor anti-pattern)
- Template-looking layouts
- Vague or generic testimonials
- Hiding the $297 price — show it, anchor against the value

---

## Site Architecture

**Single long-form sales page** — one HTML file with scroll-triggered sections.

### Sections (top to bottom):

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Sticky Nav** | Logo + "Start Now" CTA button, collapses on scroll |
| 2 | **Hero** | Full-viewport, dark navy BG. Headline + subline + primary CTA. 3D scroll asset placeholder. |
| 3 | **Credential Bar** | Horizontal strip: UFC Veteran · NASM CPT x4 · BJJ Black Belt · 12 Years Pro |
| 4 | **The Problem** | Address pain points and fake beliefs. "You've been told..." format. Light section. |
| 5 | **Meet Hannah** | Her story, hypothyroid journey, credentials in detail. Photo + bio. Dark section. |
| 6 | **The Gold Standard Method** | Name the system. Overview of the dual-track approach (Fat Loss + Muscle). |
| 7 | **What's Inside** | Tabbed curriculum breakdown — Fat Loss track / Muscle Building track. Accordion-style lesson list. |
| 8 | **Dream Outcomes** | Grid of 5 outcomes with icons. "What your life looks like after." |
| 9 | **Testimonials** | Placeholder cards for future transformations. Hannah's own before/after story. |
| 10 | **Pricing** | Three tiers: Course ($297), Group ($3,000), 1-on-1 ($1,250-$3,500). Built-in checkout forms. |
| 11 | **FAQ** | Accordion addressing every fake belief as a question. |
| 12 | **Final CTA** | Full-width dark section. Urgency copy + primary button. |
| 13 | **Footer** | Logo, social links, legal, contact. |

### Navigation Structure
- Sticky header with logo left, nav links center (Program, About, Pricing, FAQ), CTA right
- Mobile: hamburger menu with full-screen overlay
- Smooth-scroll to sections

---

## Content Framework

### Hero Headline — 3 Options (proven formulas from competitor analysis):

1. **"Train Like a Fighter. Look Like One Too."**
   — Direct, aspirational, leverages UFC credibility. Short and punchy.

2. **"The 8-Week System Built by a UFC Veteran Who Did It With a Thyroid Condition"**
   — Specific, credential-heavy, addresses the hypothyroid angle. Longer but high-conversion for cold traffic.

3. **"Stop Guessing. Start Training Like You Mean It."**
   — Action-oriented, addresses the "I've been trying on my own" audience.

**Recommended:** Option 1 as H1, Option 2 as supporting subline.

### Value Proposition Structure
- **Eyebrow:** THE GOLD STANDARD BY HANNAH GOLDY
- **H1:** Train Like a Fighter. Look Like One Too.
- **Subline:** The 8-week fat loss and muscle building system built by a UFC veteran who mastered her own body — with a thyroid condition working against her.
- **CTA:** Start Your Transformation — $297

### Section-by-Section Copy Direction

**The Problem Section:**
Address the 8 fake beliefs directly. "You've tried the generic programs. The cookie-cutter meal plans. The influencer workouts that look good on camera but don't translate to results. You've been told you need to train 6 hours a day, cut out every food you love, and have 'good genetics' to look like this. That's not true. And I can prove it."

**Meet Hannah Section:**
Personal story arc: Pro athlete → hypothyroid diagnosis → figured out how to optimize despite the condition → built the system she wished existed → now sharing it. Keep it real, not clinical.

**The Method Section:**
Name it "The Gold Standard Method." Three pillars: Train Smart (phased programming), Eat Right (macro-based, flexible), Live It (lifestyle habits for sustainability). This creates the proprietary method name that competitors like WarriorBabe use effectively.

**Pricing Section:**
Anchor the $297 against what you'd pay for: personal trainer ($80-150/session x 24 sessions = $1,920-$3,600), nutritionist ($200-500/month), plus the 12 years of knowledge. "You get all of it for less than the cost of one month with a mediocre trainer."

### SEO Keyword Targets
- Primary: "online fitness program for women," "fat loss program," "muscle building course"
- Secondary: "UFC fighter workout women," "hypothyroid fat loss," "fighter physique program"
- Branded: "the gold standard fitness," "hannah goldy program," "hannah goldy course"

---

## Conversion Playbook

### Primary Conversion Goal
Course purchase ($297) via built-in checkout form

### Lead Capture Strategy
- Email capture on the pricing section for users not ready to buy: "Get the Free Training Guide" (future lead magnet)
- Sticky CTA in nav ensures checkout is always one click away

### Social Proof Plan
**Now (launch):**
- Hannah's credentials as badges (UFC, NASM x4, BJJ, 12 Years)
- Hannah's own transformation story (hypothyroid → fighter physique)
- Placeholder cards styled and ready for future testimonials

**Later (post-launch):**
- Client before/after photos with metrics
- Video testimonials
- Specific result numbers ("lost 22lbs in 8 weeks")

### Trust Signal Checklist
- [x] UFC credential badge
- [x] NASM x4 certification badge
- [x] BJJ Black Belt badge
- [x] 12 Years Pro Athlete badge
- [x] Secure checkout indicators
- [x] Money-back guarantee (if offered — recommend adding)
- [x] Instagram follower count as social proof
- [ ] Testimonials (placeholder for now)
- [ ] Media mentions / press logos (if any exist)

---

## Checkout Architecture

Built directly into the sales page — three pricing cards side by side:

### Tier 1: The Gold Standard Course — $297
- 8-12 week structured program
- Fat Loss + Muscle Building tracks
- Training routines (Phase 1, 2, 3)
- Nutrition programs & macro setup
- Cardio protocols
- Mindset & lifestyle modules
- Lifetime access
- **CTA: "Get The Course"**

### Tier 2: Group Coaching — $3,000
- Everything in the course
- 8-week intensive group coaching
- Weekly group calls with Hannah
- All specialties, advanced programming
- Community access
- **CTA: "Join the Group"**

### Tier 3: 1-on-1 with Hannah
- Everything in the course
- Private calls with Hannah
- 2 calls: $1,250 / 4 calls: $2,500 / 6 calls: $3,500
- Personalized programming
- Direct access to Hannah
- **CTA: "Go 1-on-1"**

**Checkout Implementation:**
- Stripe-ready form fields (name, email, card)
- For now: forms will capture data and can be wired to Stripe, Square, or any processor
- Clean, inline checkout — no redirect to external page

---

## Technical Implementation

### Stack
- HTML5, CSS3, vanilla JavaScript
- GSAP 3 + ScrollTrigger (CDN)
- Google Fonts (Anton, Bebas Neue, Inter)
- Mobile-first responsive design
- No frameworks, no build tools — portable and fast

### Performance Targets
- Lighthouse 90+ all categories
- Lazy load all images
- `will-change` hints on animated elements
- `prefers-reduced-motion` support
- No render-blocking resources (async/defer scripts)

### Suggested Domain
- **thegoldstandardfitness.com** (primary recommendation)
- Alternatives: goldstandardbyhannahgoldy.com, traingoldstandard.com

---

## APPROVAL CHECKPOINT

**This is the hard stop.** Before I build the website, please review and confirm:

1. **Headline direction** — "Train Like a Fighter. Look Like One Too." with the subline about the 8-week system + thyroid condition. Good?
2. **Page structure** — Single sales page with the 13 sections listed above. Anything to add/remove?
3. **Pricing display** — All three tiers visible with built-in checkout forms. Good?
4. **"The Gold Standard Method"** — Naming the system with three pillars (Train Smart, Eat Right, Live It). Good?
5. **Design** — Navy/gold palette, Anton headlines, scroll animations, dark/light alternating sections. Good?

**Ready to build?**
