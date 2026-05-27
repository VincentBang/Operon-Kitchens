# Operon Kitchens Web App

This repository contains a prototype of **Operon Kitchens**, a Sydney‑based kitchen renovation quoting and education platform. The goal of this project is to provide homeowners with an instant starting estimate for their kitchen renovation, while making scope assumptions and exclusions explicit and protecting the business margin. It also includes product pages, a glossary, educational guides and a quote review tool.

## Features

* Multi‑step quote wizard capturing property details, scope, cabinetry, benchtop, splashback and trade allowances.
* Instant pricing using a TypeScript pricing engine that reads editable rates from `src/data/rateCard.json`.
* Confidence scoring based on information completeness and risk factors.
* Quote review tool with checklist or file upload for analysing existing quotes.
* Product category pages explaining options and their impact on pricing.
* Kitchen glossary with common terms and definitions.
* Location pages targeting Sydney suburbs and highlighting access considerations.
* Guides covering cost, measurement and compliance topics.
* Simple admin dashboard placeholder illustrating how leads and rate cards could be managed.

## Getting started

This project is built with [Next.js](https://nextjs.org/) and TypeScript. To run it locally you will need Node.js installed. Follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

3. Build for production:

   ```bash
   npm run build
   npm start
   ```

## Pricing engine documentation

The pricing engine logic lives in `src/lib/pricing.ts`. It exports a `calculatePricing` function that accepts a `QuoteInput` object and returns detailed line items, subtotal, margin, contingency, GST, total and a confidence score. The calculation uses rates defined in `src/data/rateCard.json`. Adjusting the numbers in the rate card will change the resulting estimates.

Key considerations:

* **Cabinetry**: base, overhead and tall cabinets are charged per linear metre or per unit. Drawer runners and hinges have tiered rates.
* **Finishes**: door and panel finishes have different price points (melamine, laminate, thermo, polyurethane, veneer, shaker, custom).
* **Accessories**: optional accessories add to the cost according to the selected items.
* **Benchtop and splashback**: the selected material and measured length/area determines the price. Natural stone options are flagged for compliance review.
* **Installation and trades**: installation labour scales with the scope. Trade allowances apply when selected.
* **Access loading**: if the property is above ground level without a lift or has limited parking, a percentage loading is applied.
* **Margin and contingency**: configured percentages are applied to cover overheads and unknowns. Contingency increases for low confidence quotes.
* **GST**: Australian Goods and Services Tax (10%) is applied at the end.

## Sample rate card

The sample rate card provided (`src/data/rateCard.json`) contains placeholder numbers for demonstration. These values are **not representative of actual market rates**. Before using the system in production, replace the placeholders with real supplier and labour costs and adjust the structure as needed. The admin dashboard is designed to allow editing of these values.

## Further development

This prototype focuses on demonstrating structure and core logic. To move towards a production‑ready system the following should be addressed:

* **Database integration**: connect to a database such as Supabase/Postgres to persist leads, rate cards and admin data.
* **Authentication**: secure the admin dashboard with proper authentication and authorisation.
* **File uploads**: implement secure storage (e.g. S3 or Supabase Storage) with validation and size limits.
* **Dynamic content management**: allow editing of product pages, glossary, guides and FAQs through an admin CMS.
* **Comprehensive testing**: build out unit and integration tests for the pricing engine and form flows using Jest and React Testing Library.
* **Responsive design**: refine mobile layouts and add visual polish consistent with a premium brand.
* **Compliance checks**: integrate real‑time checks against NSW Fair Trading, SafeWork NSW and Australian Consumer Law guidelines. Always confirm the availability and legality of materials such as engineered stone alternatives.

## License

This project is provided for demonstration purposes and does not include any proprietary content from third‑party sites. Use it as a starting point for your own kitchen renovation quoting platform.