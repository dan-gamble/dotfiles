# CSS

Files: `src/stylesheets/modules/<folder>/<name>.pcss`, globbed in an arbitrary order within a layer (`theme.pcss` fixes the layer order: first, vendor, helpers, base, globals, modules). Any CSS that breaks when the glob order changes is wrong.

## File anatomy

```
/*
|--------------------------------------------------------------------------
| Highlights
|--------------------------------------------------------------------------
| @namespace: sec
|
*/
.sec-Highlights { ... }
.sec-Highlights-light { ... }      <- variants follow their base with no blank line

.sec-Highlights_Inner { ... }      <- blank line between nodes

/*
|--------------------------------------------------------------------------
| Media                            <- banner per region
|--------------------------------------------------------------------------
|
*/
```

Inside a block, in this order, blank line between groups: custom properties; declarations by group (content; position/inset/z-index; flex; grid; box: display, sizes, margin, padding; typography; visual: background, border, color, opacity, overflow; animation/transform/transition); properties the config does not list, each after a blank line (`gap`, `aspect-ratio`, `object-fit`, `pointer-events`, `scroll-snap-*`, `isolation`, `translate`); `@supports`; `@media` ascending; nested `&::after`, `&:hover`, `.context &`. Flex and grid properties precede `display`. The installed `stylelint-config-unisian` is the authority; run `stylelint --fix` first, then edit, then lint again, because the fixer reorders blocks and a string edit made before it can silently miss.

## Rules

- Each key selector is defined at root exactly once in the project; every override, state and media query lives inside that block.
- Permitted nesting: `@media`, `@supports`, `&:pseudo`, `&::pseudo`, `&[attr]`, `.ns-Parent-variant &`. Context selectors name the module: `.btn-Button[aria-busy='true'] &`, never a bare `[aria-busy='true'] &`.
- The lint config enforces specificity 0,3,0, max 3 classes, max 2 combinators, no ids, no `!important`, type selectors only `svg`, `path`, `circle`, `rect`, logical properties. `/* stylelint-disable-next-line selector-max-specificity */` for the rare fourth class.
- Root declares every property once; variants and states set only module variables, prefixed with the module: `.btn-Button-dark { --Button_Background: var(--Color_Brand) }`.
- Values come from the target theme's `helpers/definitions/property-definitions.pcss` (the starter ships `--Color_Brand`, `--Color_Border`, `--Site_Margin`, `--Grid_Gutter`, `--Header_Height`; a build adds its own). No literal hex where a token exists; a tint is a token with `opacity`.
- Typography through the theme's `fz-` classes where it has them (`fz-<size>_<lineHeight>`, each with its own responsive step); read `globals/font-size.pcss` first. Where a token's small step differs from the drawn size by a few px, the token wins. Modules set only what base and the token leave alone: colour, margin, weight if the token has none.
- Custom media only, mobile first, from `helpers/definitions/media-definitions.pcss` (`--sm`, `--md` and the rest; `--hover`, `--motion-reduce`; `--<size>-viewport` for one size only). Never a hand-written max-width.
- Hover only under `@media (--hover)`. One hover language per site: the hovered item stays, siblings fade or scale down, with `pointer-events: none` on the list and `auto` on items.
- Durations in a module variable, zeroed under `@media (--motion-reduce)`.
- The module owns its `:focus-visible` ring; never remove an outline without replacing it.
- Crossfades delay the outgoing layer: `transition: opacity 0s ease <duration>` on the hidden state.
- Spacing lives on the optional element: `_Kicker { margin-block-end }`, `_Text { margin-block-start }`, `_Buttons { margin-block-start }`, `_Title` carries none. A `_Header` before a `_Body` carries `margin-block-end`.
- Link lists space with link padding, not gap, so hit areas grow; `:has(.x_Count)` adjusts for optional children.
- Structural wrappers own layout; cards never carry outer margin. `_Items` is the grid, `_Item` the cell.
- Page-grid alignment is `repeat(12, minmax(0, 1fr))` with `column-gap: var(--Grid_Gutter)` inside a `lyt-Container`; place children by `grid-column`.
- A root with negative-z children gets `isolation: isolate`; never a transparent background as a workaround.
- Cover an image box: give the box `display: flex` (or `display: grid; grid-template-rows: minmax(0, 1fr)`) around `responsive-image`; the stretched wrapper drops the snippet's aspect ratio. Plain `display: grid` is not enough.
- Sizing: `aspect-ratio`, not the `::after` padding hack. Prefer content-driven height with the design's minimum; a fixed aspect on a section root cannot grow.
- `:has()` on the root for slot-dependent layout (`.btn-Button:has(.btn-Button_Icon)`), not `-hasX` variants.
