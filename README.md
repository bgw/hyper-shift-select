# hyper-shift-select

![](demo.gif)

Most terminals don't pass through mouse events while a certain modifier key is
pressed. On OS X, that modifier is usually `alt`. On Linux, that modifier key is
usually `shift`.

Hyper 2.x depends on xterm 2.9.2. Version 3 of xterm fixes some issues around
this behavior, but those fixes likely won't get backported.

So instead, this plugin monkey-patches xterm's `SelectionManager` and hooks into
the terminals event handlers to:

- [Allow the shift key to be used as that modifier key on non-Mac operating
  systems.](https://github.com/Tyriar/xterm.js/commit/0e0ecc2d6a64)
- [Avoid passing through mousedown events while the modifier key is
  pressed.](https://github.com/xtermjs/xterm.js/pull/1091)

**Important:** Designed for Hyper 2.x

---

## Install

Edit your `~/.hyper.js`:

```
plugins: [
  'hyper-shift-select',
],
```
