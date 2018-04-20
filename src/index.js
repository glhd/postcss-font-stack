import * as postcss from "postcss";

const defaults = {
  decl: "font-stack",
  classGenerator: target => `.has-${target}-font`,
  stacks: {
    body: {
      target: "exchange",
      fallbacks: "Georgia, serif",
      adjustments: {
        letterSpacing: "0.1px",
      },
    }
  }
};

const defaultStack = {
  target: "",
  fallbacks: "",
  adjustments: {}
};

const defaultAdjustments = {
  letterSpacing: null,
  wordSpacing: null,
  lineHeight: null,
  fontWeight: null,
  fontSize: 1,
};

function fontStackAtRule(parent, rule, options) {
  const stackConfig = options.stacks[rule.value];

  if (!stackConfig) {
    throw new Error(`Font stack "${rule.value}" is not configured.`);
  }

  const stack = Object.assign({}, defaultStack, stackConfig);
  stack.adjustments = Object.assign({}, defaultAdjustments, stack.adjustments);

  // Apply fallback font family

  const fallbackRule = postcss.decl({
    prop: 'font-family',
    value: stack.fallbacks,
  });

  rule.replaceWith(fallbackRule);

  // Apply configured adjustments

  const adjustments = {
    letterSpacing: 'letter-spacing',
    wordSpacing: 'word-spacing',
    lineHeight: 'line-height',
    fontWeight: 'font-weight',
  };

  Object.keys(adjustments).forEach(adjustment => {
    if (null === stack.adjustments[adjustment]) {
      return;
    }

    fallbackRule.after(postcss.decl({
      prop: adjustments[adjustment],
      value: stack.adjustments[adjustment],
    }));
  });

  // Create rule for when font is loaded

  const loadedRule = postcss.rule({
    selector: `${options.classGenerator(stack.target)} ${parent.selector}`,
  });

  loadedRule.append(postcss.decl({
    prop: 'font-family',
    value: `${stack.target}, ${stack.fallbacks}`,
  }));

  // Reset adjustments when loaded

  Object.keys(adjustments).forEach(adjustment => {
    if (null === stack.adjustments[adjustment]) {
      return;
    }

    loadedRule.append(postcss.decl({
      prop: adjustments[adjustment],
      value: 0,
    }));
  });

  // Add rule

  parent.after(loadedRule);
}

export default postcss.plugin(
  "postcss-font-stacks", 
  (opts = defaults) => root => root.walkRules(rule => rule.walkDecls(opts.decl, at => fontStackAtRule(rule, at, opts)))
);