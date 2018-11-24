import * as postcss from "postcss";

const defaults = {
  decl: `font-stack`,
  loadingClass: 'wf-loading',
  activeClass: 'wf-active',
  inactiveClass: 'wf-inactive',
  stacks: {}
};

const defaultStack = {
  target: ``,
  fallbacks: ``,
  adjustments: {}
};

const defaultAdjustments = {
  letterSpacing: null,
  wordSpacing: null,
  lineHeight: null,
  fontWeight: null,
  fontSize: 1,
};

const adjustments = {
  letterSpacing: 'letter-spacing',
  wordSpacing: 'word-spacing',
  lineHeight: 'line-height',
  fontWeight: 'font-weight',
};

function fontStackAtRule(rule, decl, options) {
  const stackConfig = options.stacks[decl.value];

  if (!stackConfig) {
    throw new Error(`Font stack "${decl.value}" is not configured.`);
  }

  const stack = Object.assign({}, defaultStack, stackConfig);
  stack.adjustments = Object.assign({}, defaultAdjustments, stack.adjustments);

  // Apply font-family declaration

  decl.replaceWith(postcss.decl({
    prop: 'font-family',
    value: stack.fallbacks,
  }));

  // Apply configured adjustments

  Object.keys(adjustments).forEach(adjustment => {
    if (null === stack.adjustments[adjustment]) {
      return;
    }

    rule.append(postcss.decl({
      prop: adjustments[adjustment],
      value: `${stack.adjustments[adjustment]}`,
    }));
  });

  // Create rule for when font is loaded

  const loadedRule = postcss.rule({
    selector: rule.selector
      .replace(/\s*\n+\s*/g, ' ')
      .split(',')
      .map(selector => `.${options.activeClass} ${selector}`)
      .join(',')
  });

  loadedRule.append(postcss.decl({
    prop: 'font-family',
    value: `${stack.target}, ${stack.fallbacks}`,
  }));

  rule.after(loadedRule);
}

export default postcss.plugin("postcss-font-stacks", (config = {}) => {
  const opts = Object.assign({}, defaults, config);
  return root => root.walkRules(rule => rule.walkDecls(opts.decl, at => fontStackAtRule(rule, at, opts)));
});
