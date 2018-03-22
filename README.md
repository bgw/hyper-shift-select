# hyper-shift-select

**DO NOT USE THIS PLUGIN.** Instead, upgrade to the latest version of Hyper 2.x.
It fixes the issues this was intended to solve.

This plugin is unmaintained.

---

![](demo.gif)

Most terminals don't pass through mouse events while a certain modifier key is
pressed. On OS X, that modifier is usually `alt`. On Linux, that modifier key is
usually `shift`.

Hyper 2.x depends on xterm.js 2.9.2. Version 3 of xterm.js fixes some issues
around this behavior, but those fixes likely won't get backported.

So instead, this plugin monkey-patches xterm.js's `SelectionManager` and hooks
into the terminals event handlers to:

- [Allow the shift key to be used as that modifier key on non-Mac operating
  systems.](https://github.com/Tyriar/xterm.js/commit/0e0ecc2d6a64)
- [Avoid passing through mousedown events while the modifier key is
  pressed.](https://github.com/xtermjs/xterm.js/pull/1091)

This plugin also fixes a bug where [copying text from an application in
alt-screen mode wouldn't copy from the correct
buffer](https://github.com/zeit/hyper/issues/2429).

**Important:** Designed for Hyper 2.x

---

## Install

Edit your `~/.hyper.js`:

```
plugins: [
  'hyper-shift-select',
],
```
