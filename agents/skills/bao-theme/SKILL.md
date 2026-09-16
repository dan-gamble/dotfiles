---
name: bao-theme
description: Build or edit a BAO Shopify theme piece (section, block, snippet, .pcss module, custom element) on the starter-theme pipeline with ECSS naming. Trigger on any theme work in a BAO repo (Shopify-starter-theme-2.0 descendants), on ".pcss", "ECSS", "sec-/blk-/prd- classes", "theme dev", or a Figma-to-theme request.
---

# BAO theme piece

You are building one piece of a BAO Shopify theme from a design. The target theme is the source of truth for what exists (tokens, globals, snippets, elements); the reference files are the source of truth for how BAO writes it. Read a reference file when the step names it: every piece needs `naming` and `css`; Liquid work needs `liquid`; an element needs `js`; running it needs `pipeline`; a Figma brief needs `design-reading`.

## 1. Read the design, then the theme

1. Open the Figma region at desktop and mobile. Record every node's size and position and every text node's size and line height, per [references/design-reading.md](references/design-reading.md).
2. Read the theme's layer files (`src/stylesheets/theme.pcss`, `helpers/definitions/*`, `globals/*`, `base/_define.pcss`), `config/settings_schema.json`, `locales/en.default.json`, and the two or three existing sections closest in shape to the piece.
3. Before using any token, `fz-` class, global module, snippet, custom element or locale key, grep for it in the target theme. Absent means unavailable: name it nowhere, or add it as a global with its own file.

Done when: the measurements are written down, the closest sections have been read, and every primitive you plan to use has a grep hit.

## 2. Decide the shape

Apply [references/naming.md](references/naming.md) and [references/liquid.md](references/liquid.md). Decide and write down: the namespace and module name; each child name; whether blocks are section-local or theme blocks; which content is per block, per section setting, or from a metafield; where the custom element boundary sits.

Done when: those five decisions are listed.

## 3. Write

CSS per [references/css.md](references/css.md), JS per [references/js.md](references/js.md), Liquid per [references/liquid.md](references/liquid.md).

Done when: `npm run lint:css` and `npm run lint:js` report zero errors and the Liquid is formatted with the repo's prettier plugin.

## 4. Run and measure

Start the theme per [references/pipeline.md](references/pipeline.md). In a browser at the design's desktop and mobile widths:

1. Measure the nodes recorded in step 1 with `getBoundingClientRect` and compare. Over 2px is a defect unless a type token explains it; log the cause either way.
2. Exercise every state: hover, keyboard focus, each setting value, each optional field empty, a missing image, the theme editor preview.
3. Confirm with `elementFromPoint` that text is selectable and the intended link answers a click.

Done when: each recorded measurement is matched or logged with its cause, and every state has been seen rendering.
