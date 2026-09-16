# Naming (ECSS as BAO rules it)

`.ns-Module_Child-variant`

- **Namespace**: the folder's abbreviation under `src/stylesheets/modules/`, 2 or 3 lowercase letters (the lint pattern allows 4; only `util` uses it) (`section/` is `sec`, `block/` is `blk`, `product/` is `prd`, `collection/` is `clc`, `header/` is `hd`, `footer/` is `ft`, `drawer/` is `drw`, `push-cart/` is `psh`). Globals: `lyt`, `btn`, `fz`, `frm`, `rsp`, `bdc`, `util`.
- **Module**: PascalCase, one per file, named for the file. `section-highlights.pcss` is `.sec-Highlights`.
- **Child**: `_PascalCase`, one level, one or two words. Three words means the module is overloaded.
- **Variant**: `-camelCase`, last segment, on the module or a child. Built in Liquid it is still camelCase: `-card{{ colour | capitalize }}`, never `-cardlight`.
- Two classes on one element are composed in the markup, each with its own root block. Never `&.ns-Other`.
- Global classes compose beside a host child: `sec-Hero_Button btn-Button btn-Button-primary`. `lyt-Container` stacks only with an `_Inner`.

## Base vocabulary

Reuse before inventing: `_Inner`, `_Header`, `_Body`, `_Footer`, `_Heading`, `_Title`, `_Kicker`, `_Text`, `_Content`, `_Items`, `_Item`, `_Link`, `_Button`, `_Buttons`, `_Controls`, `_Control`, `_Arrows`, `_Arrow`, `_Icon`, `_Image`, `_Video`, `_MediaContainer`, `_Overlay`, `_Faux`, `_Count`, `_Label`, `_Columns`, `_Column`, `_Grid`, `_Slides`, `_Slide`.

- `_Inner` holds structural regions only: `_Header`, `_Body`, `_Footer` by default, plus regions a layout genuinely has (`_MediaContainer` behind them, `_FiltersBar`, `_TopBar`, `_Nav`, `_Copyright`). Content nodes (`_Title`, `_Text`, `_Items`) never sit directly in `_Inner`.
- `_MediaContainer` is the media box; its tint is `::after`, never a node.
- `_Overlay` is the content layer over media.
- Name for meaning (`_Optional`), not appearance (`_LabelSubdued`). "Strong" reads as a state, so `_TextIntro` with `-strong`, not `_TextIntroStrong`.
- Desktop/mobile twins of one node are variants: `_Image-desktop`, `_Image-mobile`, `_Title-desktop`.

## State

- ARIA on the control: `aria-current`, `aria-expanded`, `aria-busy`, `aria-hidden`, `[open]`, `[disabled]`. Always present, `"true"` or `"false"`, never toggled by absence.
- Wrappers read the control with `:has()`; siblings read it through a qualified context selector: `.rb-Item[aria-current='true'] &`.
- A `-variant` class for JS-set state only where no ARIA semantic exists (`-hasScrolled`).
- Never `aria-hidden` a native input you are visually hiding; never `tabindex="-1"` the only link in a tile.
