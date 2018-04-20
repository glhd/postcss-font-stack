import * as postcss from "postcss";

const defaults = {
  decl: `font-stack`,
  classGenerator: target => `.has-${target}-font`,
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

  // Apply fallback font family

  const fallbackDecl = postcss.decl({
    prop: 'font-family',
    value: stack.fallbacks,
  });

  decl.replaceWith(fallbackDecl);

  // Apply configured adjustments

  Object.keys(adjustments).forEach(adjustment => {
    if (null === stack.adjustments[adjustment]) {
      return;
    }

    fallbackDecl.after(postcss.decl({
      prop: adjustments[adjustment],
      value: stack.adjustments[adjustment],
    }));
  });

  // Create rule for when font is loaded

  const loadedRule = postcss.rule({
    selector: `${options.classGenerator(stack.target)} ${rule.selector}`,
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

  rule.after(loadedRule);
}

export default postcss.plugin(
  "postcss-font-stacks", 
  (opts = defaults) => root => root.walkRules(rule => rule.walkDecls(opts.decl, at => fontStackAtRule(rule, at, opts)))
);
