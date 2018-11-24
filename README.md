# postcss-font-stack

A PostCSS plugin to use configured font stacks with fallback adjustments.

## Getting Started

First, you need to figure out for fallback configuration using the wonderful
[font style matcher](https://meowni.ca/font-style-matcher/).

Next, configure your font stack using the adjustments from the font style matcher:

### Example Config

```js
{
  stacks: {
    ui: {
      target: `Roboto`,
      fallbacks: `Arial, sans-serif`,
      adjustments: {
        letterSpacing: `-0.003125rem`,
        wordSpacing: `-0.009375rem`
      }
    }
  }
}
```

Use your font stack in anywhere in your CSS:

### CSS

```css
.btn {
  font-stack: ui;
}
```

If you're using Typekit, everything else is set up for you. If not, check out
the [font face observer](https://fontfaceobserver.com/) library, and set up something
along the lines of:

```js
const fontObserver = new FontFaceObserver(`Roboto`);
fontObserver.load().then(() => {
	document.documentElement.className += ` has-roboto-font`;
});
```

Your final CSS will look something like this:

### Example Output

```css
.wf-loading .btn, .wf-inactive .btn {
  font-family: Arial, sans-serif;
  letter-spacing: -0.003125rem;
  word-spacing: -0.009375rem;
}
.wf-active .btn {
  font-family: Roboto, Arial, sans-serif;
}
```