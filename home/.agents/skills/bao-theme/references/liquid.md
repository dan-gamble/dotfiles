# Liquid

## Section anatomy

```liquid
{%- liquid
  assign content_colour = section.settings.content_colour

  if request.visual_preview_mode
    assign title = 'sections.visual_preview_mode.title' | t
    assign text = 'sections.visual_preview_mode.text' | t
  else
    assign title = section.settings.title
    assign text = section.settings.text
  endif
-%}

<script type="module" src="{{ 'section-name.js' | asset_url }}"></script>   <- only when the section has an element

<section class="sec-Name sec-Name-{{ content_colour }}">
  <div class="sec-Name_Inner lyt-Container">
    <header class="sec-Name_Header">…</header>
    <div class="sec-Name_Body">…</div>
  </div>
</section>
```

Generic, reusable sections use the theme's chrome module instead, where one exists. Example, shackleton's `sec-Section`: `sec-Section` > `sec-Section_Inner lyt-Container` > `sec-Section_Header` (title, ancillary link, `_Controls`) + `sec-Section_Body` holding the feature module. Template sections (product, collection, article) and bespoke sections own their structure.

- A `{%- liquid -%}` block resolves every setting into a plain variable first; markup reads only variables. `newline_to_br` on textarea settings.
- Variant classes come from the resolved variables. A `-first` variant from `section.index0 == 0` only where the first instance renders differently (under a transparent header).
- Preview content, labels and shorthand come from `locales/en.default.json` (`sections.visual_preview_mode.*`, `accessibility.previous_slide`); counts get a pluralised key rendered with `| t: count: count`.
- `template-*` sections (collection banner, product) read per-object data from metafields (`collection.metafields.hero.*`); their schema is often just a name.
- Text variants are content-driven; a media variant gets the design's `min-block-size`. Only the top section of a page under a transparent header adds the header to its top padding (`calc(<the theme's header-height token> + <offset>)`, `--Header_Height` in the starter) and measures its height from the page top.

## Blocks

- Section-local block (`"type": "card"` in the section schema, markup inline in the loop) unless more than one section renders it; then a theme block `blocks/_name.liquid` with `"tag": null`, rendered by `{%- render block -%}`. Theme blocks only in a theme that already has a `blocks/` folder; the starter has none.
- The section owns `_Items`/`_Item` and `{{ block.shopify_attributes }}`; the block owns its own module.
- Per-block content is whatever varies across the design's instances (title, colour, overlay, video).
- A block that points at a Shopify object (collection, product, article) auto-populates from it, with manual overrides in a second schema group. Data derived from the object renders only when the object is set.

## Media

- Every image goes through `{% render 'responsive-image', image: image, width: 1440, height: 1600, desktop_viewport: '50vw', mobile_viewport: '100vw', alt: '' %}` (named arguments; `loading`, `fetchpriority`, `sizes` optional). Desktop and mobile variants are two renders (`_Image-desktop`, `_Image-mobile`); the hidden one gets `'0px'` for its viewport so it never fetches. Viewport values are the node's real width (`'58vw'`, `'60px'`), not the page.
- Video: `<lazy-video><video autoplay loop muted playsinline>` with `<source data-src>` per source.
- `_MediaContainer { position: absolute; inset: 0; z-index: -1; overflow: hidden }` with the tint on `::after` and an inline `--Module_Overlay` for its opacity.

## Cards and links

```liquid
<article class="blk-Card util-FauxLink">
  <div class="blk-Card_MediaContainer">…</div>
  <a class="blk-Card_Faux util-FauxLink_Link" href="…" aria-hidden="true" tabindex="-1"></a>
  <div class="blk-Card_Overlay">
    <p class="blk-Card_Kicker fz-…">…</p>
    <h3 class="blk-Card_Title fz-…"><a class="blk-Card_Link" href="…">…</a></h3>
    <p class="blk-Card_Text fz-…">…</p>
    <a class="blk-Card_Button btn-Button btn-Button-primary" href="…">…the theme's button markup…</a>
  </div>
</article>
```

- The faux link (z 1) makes the image area navigate; `_Overlay` sits above it (z 2) so text is selectable; the title link is the one text tab stop. A stretched `::after` on the title link fails when `_Overlay` is positioned.
- Hover-only affordances (a revealed button) are gated on `--hover` and always visible on touch.
- Buttons compose the theme's `btn-Button` global and its variants; read `globals/buttons.pcss` and the button snippets it expects (`button-text` element, arrow snippet) before writing one. A text link is the same global without the primary variant.
- Long text with a "Read More" opens a drawer through the theme's drawer system (`<dialog is="site-drawer" key="…">` from `site-drawer.js`, registered in `drawers.liquid`, opened by a `data-drawers-trigger` button); truncate by characters so the trigger sits inline with the ellipsis.
- Breadcrumbs: `{% render 'breadcrumbs' %}` inside a module wrapper that only positions and colours it.
- Merchant HTML gets `rte-RichText`.
- Something a module cannot reach (a global snippet's output) that a design drops on one viewport gets a `util-` visibility class; add it to `helpers/utils.pcss` if the theme has none.

## Forms

Global `frm-` modules from `globals/forms.pcss`; ARIA state (`aria-invalid`, `aria-describedby`) on the input, wrappers read it with `:has()`. A visually hidden native input gets `util-ScreenReaderOnly`, never `aria-hidden`. Groups of radios are `<fieldset>` + `<legend>`. Real attributes: `type`, `autocomplete`, `required`.
