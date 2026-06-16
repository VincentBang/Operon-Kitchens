# Visual Release Review: 17 June 2026

Purpose: record the local visual-system release review before any approved deploy.

Deployment status: not needed. This was a local static-export review only.

## Routes Checked

Local static export was rebuilt and served from `out/`.

Checked routes:

- `/`
- `/quote/review`
- `/request-review`
- `/faqs`
- `/admin/leads`

Static file paths were used for local review because a raw static file server does not provide Netlify-style clean URL rewrites.

## Viewports Checked

- `1440px`
- `768px`
- `390px`
- `360px`

## Result

No visual blocker was found in the checked release-candidate route group.

Confirmed locally:

- no horizontal overflow at checked widths
- header appears on public pages
- footer appears on public pages
- footer does not show `brand.Planning`
- chatbot does not show `scope??Ask`
- chatbot launcher shows the current `Ask Operon` / `Kitchen scope guidance` marker
- chatbot does not overlap a detected sticky CTA
- public pages do not link to `/admin/leads`
- `/admin/leads` remains isolated from public header/footer
- no `final price comparison` text on checked pages
- `/faqs` has one clear H1 and renders from static export
- `/quote/review` has one clear H1 and renders from static export
- `/request-review` has one clear H1 and renders from static export

## Notes

- `/request-review` intentionally does not show the chatbot, which keeps the form path focused.
- `/admin/leads` intentionally has no public header/footer and no chatbot.
- The local static server may require `.html` paths. This does not indicate a Netlify issue when production publishes `out`.

## Release Recommendation

The visual-system bundle can be included with the trust-polish bundle in one future approved release.

If Netlify credits are tight, release only the trust/visual bundle first and keep file-upload signed-download/soft-delete work for a separate approved checkpoint.

## Still Deferred

- production deploy
- production verification
- file-upload signed-download live verification
- delete button
- physical file deletion
- retention automation
- payment
- customer auth
- full CRM
