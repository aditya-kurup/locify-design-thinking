# Locify

Locify is a design thinking prototype for the question: **“Who nearby has this item right now?”** A customer posts a request once; nearby independent shops can reply with availability, price, and readiness, so the customer can compare local options.

## Project context

This prototype is based on the supplied Locify design thinking presentation and its Phase 1 findings. It frames two user groups: students and young professionals who need a specific or urgent item, and neighbourhood retailers who may have useful stock but do not maintain item-level online catalogues. The root cause in the deck is the lack of a low-effort channel connecting current customer demand to current local stock.

The initial persona is Riya, a 21-year-old engineering student. Her journey moves from an urgent need to online search, calls or visits to shops, comparison, and purchase. The design prompt is to help customers find nearby stock without requiring vendors to catalogue everything, while making replies quick and trustworthy.

The presentation also contains preliminary patent, publication, and product scans. Those summaries are included in the report as supplied context; they have not been independently verified and are not legal advice or a novelty assessment.

## Run locally

Requirements: Node.js and npm.


default


default


default


default


default

```sh
npm run dev
```

Open the local URL printed by the server. The project is a static site: no bundler or build step is required.

## Deploy

The repository can be imported directly into Netlify or Vercel as a static site. Set the publish/output directory to the repository root; no build command is needed. It can also be served from any static web host. The Lucide icon script and Google Fonts are loaded from CDNs, so those assets require internet access unless you self-host them.

## Prototype features

- Request form with item, category, radius, urgency, and optional photo selection
- Sample local request feed with illustrative shop offers
- Client-side request posting for the current page session
- Switch between list and illustrative map views
- Vendor preview with an interactive reply state
- Profile preview
- Responsive desktop and mobile layouts

## Architecture

- `index.html`: page structure and dialog content
- `styles.css`: responsive styles and illustrative map
- `app.js`: local sample data and browser interactions
- `public/`: institute identity assets extracted from the supplied deck
- `Locify_Design_Thinking_Report.docx`: completed project report

## Data and limitations

All shops, prices, distances, offers, profile metrics, and example users are illustrative. Posted requests live only in browser memory and reset on reload. The map is a visual mock and does not use GPS or map data. The prototype does not persist requests, notify real vendors, reserve items, authenticate users, process payments, or store uploaded photos.

Before a live pilot, add a backend and database, opt-in location, vendor notification and response management, moderation and abuse controls, offer expiry, privacy practices, and clear reservation/cancellation rules. Field-test the assumptions with the deck’s proposed 8–10 customers and 5–6 vendors.

## Report

The completed report follows the course template’s chapter structure and covers empathy, the persona journey, problem definition, 5-Whys, How Might We questions, the design concept, prototype, browser checks, limitations, future work, and the landscape notes from the presentation. It clearly distinguishes deck-derived context and prototype checks from real user research: no interviews or participant usability study have been conducted yet.
