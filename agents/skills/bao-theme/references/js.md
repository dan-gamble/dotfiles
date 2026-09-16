# JavaScript

`assets/<name>.js`, one ES module per element, loaded with `<script type="module" src="{{ 'name.js' | asset_url }}">` in the section. Shared libs are `@bao/*` through the importmap in `snippets/bao-head-scripts.liquid` (`@bao/custom-element`, `@bao/listeners`, `@bao/carousel`, `@bao/events`, `@bao/event-bus`, `@bao/section-rendering`, `@bao/utils`).

```js
import { BAOCustomElement } from '@bao/custom-element'

class SectionName extends BAOCustomElement() {
  static get requiredElements () {
    return ['link']
  }

  setupListeners () {
    this.els.link.elements.forEach((link) => {
      this.listeners.add(link, 'mouseenter', () => this.activate(link))
      this.listeners.add(link, 'focus', () => this.activate(link))
    })
  }

  activate (link) {
    this.els.link.elements.forEach((el) => {
      el.setAttribute('aria-current', el === link ? 'true' : 'false')
    })
  }
}

if (!customElements.get('section-name')) {
  customElements.define('section-name', SectionName)
}
```

- The element wraps the highest node that every role it needs sits under, the way React state lifts to the common parent. Often the module root, sometimes a single child when every role lives there, sometimes the whole section.
- Hooks are `data-<element-name>-el="role"` read through `this.els.role.element` / `.elements` / `.exists` / `.selector`; `data-<element-name>-external-el` reaches outside; `requiredElements` throws early when missing. Never query by class.
- `this.listeners.add(el, event, fn, options)` so `disconnectedCallback` removes everything; `setupListeners()` is the override point.
- Progressive enhancement: markup renders complete server-side; JS only sets attributes.
- Anything hover triggers also fires on `focus`.
- Reduced motion: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` selects `behavior: 'auto'`.
- Carousels: read the theme's existing carousel element before writing one; the starter ships KeenSlider and `@bao/carousel` (`setInitialised`, `useArrows`, `addWheelControls`). Size slides from module variables per breakpoint, keep a no-JS fallback under `&:not([data-initialised='true'])`, start controls `aria-hidden="true"` and set `[disabled]` at the ends. A mosaic groups blocks into column slides in Liquid.
- Cross-component talk goes through `@bao/events` and the event bus, not references.
- StandardJS style: no semicolons, single quotes, space before function parens. Run `npm run lint:js`.
