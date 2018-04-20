# postcss-font-stack

A PostCSS plugin to use configured font stacks with fallback adjustments.

See: https://meowni.ca/font-style-matcher/

## In

```css
.btn {
  font-stack: ui;
}
```

## Out

```css
.btn {
  font-family: system-ui, BlinkMacSystemFont, -apple-system, sans-serif;
}
.has-Roboto-font .btn {
  font-family: Roboto, system-ui, BlinkMacSystemFont, -apple-system, sans-serif;
}
```
