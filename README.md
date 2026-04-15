# The Gold Standard by Hannah Goldy

Premium sales page for The Gold Standard fitness program.

## Quick Start

Open `site/index.html` in a browser, or deploy to any static hosting.

## Deploy to Vercel

```bash
cd site
npx vercel
```

## Deploy to Netlify

Drag and drop the `site/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

## Project Structure

```
gold-standard/
├── research/
│   ├── 01-client-brand.md
│   ├── 02-competitor-analysis.md
│   ├── 03-build-brief.md
│   └── 04-quality-audit.md
├── competitive-analysis.html    # PDF-ready client report
├── site/
│   ├── index.html               # Main sales page
│   ├── 404.html
│   ├── css/style.css
│   ├── js/main.js
│   ├── assets/                  # Hannah's photos (1-20.png)
│   ├── robots.txt
│   └── sitemap.xml
└── README.md
```

## Wiring Payments

The checkout forms are placeholders. To connect Stripe:

1. Create a Stripe account at stripe.com
2. Replace the form `submit` handler in `js/main.js` with Stripe Checkout or Payment Links
3. Alternatively, replace checkout forms with Stripe Payment Links (simplest option)

## Image Optimization

Before deploying to production, optimize images:

```bash
# Convert PNGs to WebP (requires cwebp)
for f in site/assets/*.png; do cwebp -q 80 "$f" -o "${f%.png}.webp"; done
```

Then update image references in `index.html` to use `.webp` format.
