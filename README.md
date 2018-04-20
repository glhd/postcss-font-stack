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

Finally, set up the [font face observer](https://fontfaceobserver.com/) for your target fonts:

```js
const fontObserver = new FontFaceObserver(`Roboto`);
fontObserver.load().then(() => {
	document.documentElement.className += ` has-roboto-font`;
});
```

(This step should be more automated in the future.)

Now, your outputted CSS will look something like this:

### Example Output

```css
.btn {
  font-family: Arial, sans-serif;
  word-spacing: -0.009375rem;
  letter-spacing: -0.003125rem;
}
.has-roboto-font .btn {
  font-family: Roboto, Arial, sans-serif;
  letter-spacing: 0;
  word-spacing: 0;
}
```