# Pipeline

- `npm run dev` runs `vite build --watch` (CSS into `assets/theme.css`) and `shopify theme dev` together. Run them in separate panes. After adding a `.pcss` file, grep `assets/theme.css` for its module; if absent, restart the watcher (observed with Vite 4: the glob is not re-expanded).
- `shopify theme dev` uploads in change order (observed with CLI 4.8). A template that names a new section, or a section whose preset names a new block, is rejected until the dependency has uploaded: touch block, then section, then template.
- The store in `package.json` may be the live store. Check `shopify theme list --store <handle>` and point `shopify:serve` at the dev store on a branch. `shopify theme dev` creates its own development theme; pass `--theme <id>` to reuse one and `--store-password` for a password-protected storefront.
- If the running `theme dev` starts returning 401 (observed after a second `shopify` store command elsewhere), restart it.
- Every section in a JSON template's `sections` must appear in `order`; drop both or neither.
- Liquid formatting: `npx prettier --plugin=@shopify/prettier-plugin-liquid --write <file>`. Husky runs prettier and lint on staged `.js` and `.pcss` only.
