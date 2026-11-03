# Locify

Locify is a demo-ready design thinking prototype for the question “Who nearby has this item right now?” Buyers post a request once; nearby shops can reply with availability, price, and timing so the buyer can choose a local option.

## Run the demo

Requirements: Node.js 18 or newer. No package installation is needed.

```sh
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:3000`). The same command works with `npm start`.

## Demo flow

1. In Buyer view, post an item request. The three sample requests are also available for a quick start.
2. Select Vendor inbox in the header.
3. Set the shop name, enter a price, choose readiness and pickup or local delivery, then send an offer.
4. Return to Buyer view, open View replies, and choose the shop.
5. In the reservation confirmation, mark the item as collected to finish the flow.

Demo requests, shop identity, offers, reservations, and collection status persist in browser local storage. Select Reset demo in the vendor workspace to restore the sample requests and start again. All data stays in this browser and is not sent to a server.

## Project context

The supplied Locify design thinking presentation frames two users: students and young professionals seeking a specific or urgent item, and neighbourhood retailers who may have useful stock but do not maintain item-level online catalogues. Its root cause is the lack of a low-effort channel connecting current buyer demand with current local stock. The Riya journey persona, 5-Whys analysis, How Might We questions, and secondary landscape scan are documented in `Locify_Design_Thinking_Report.docx`.

Patent, publication, and product summaries in the presentation and report are source-deck summaries. They have not been independently verified and are not legal advice or a novelty assessment. The report also distinguishes the prototype walkthrough from primary user research: no interviews or participant usability study have been conducted yet.

## Deploy

The site is static and can be deployed by publishing the repository root to Netlify, Vercel, GitHub Pages, or another static host. No build command is needed. Google Fonts and Lucide icons load from CDNs and therefore need internet access unless self-hosted.

## Architecture

- `index.html`: buyer and vendor workspaces, request form, and offer dialog
- `styles.css`: responsive styles and illustrative map
- `app.js`: request, offer, reservation, completion, and local persistence logic
- `server.mjs`: dependency-free local static server
- `public/`: institute identity assets extracted from the supplied deck
- `Locify_Design_Thinking_Report.docx`: completed project report

## Demo limitations

This is a single-browser demo. Buyer and vendor views share local storage to demonstrate the end-to-end flow. Separate people or devices do not share data. There is no account system, API, database, real vendor notification, GPS, geographic map, payment, or inventory integration. Offers, sample shops, distances, and profile metrics are illustrative. A live pilot needs a backend, opt-in location, notifications, moderation, privacy practices, and verified offer and reservation rules.
