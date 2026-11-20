# Reading the design

- When the theme already has a section for the piece, match it to the Figma region by what it shows, not by the file's name.
- Record every node: x, y, width, height, and for text the size and line height. Convert positions to the page grid using the theme's `--Site_Margin` and `--Grid_Gutter` at that width: column n starts at margin + (n - 1) × (column + gutter).
- Measure a section's spacing to its own rectangle, not to the next section. The gap between sections belongs to whichever section the theme gives it to.
- A cursor drawn in a frame marks a hover state. What differs on that one card is the hover treatment, not a positional rule.
- Survey every instance of a node across the design (every card, both viewports) before deciding whether its content is per block or per section. If instances differ, it is per block.
- For the top section under a transparent header, sizes measured from the top of the page include the fixed bars above it; that section's box starts at y=0.
- When the mobile frame drops a node the desktop frame has, it is a `display` switch on the same node, not a second node, unless the two need different type tokens; then they are `-desktop`/`-mobile` twins.
- Placeholder content in a design (counts, copy) is data; build for the real object.
