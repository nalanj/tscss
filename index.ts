import type * as CSS from "csstype";

export type Style = CSS.Properties<string | number>;

export type Rules = {
  [selector: string]: Style | Rules;
};

export type RuleSet = {
  rules: Rules;
  append(newRules: Rules): RuleSet;
};

export type ClassName =
  | {
      className: string;
    }
  | string;

function concatRules(rules1: Rules, rules2: Rules): RuleSet {
  return style({ ...rules1, ...rules2 });
}

export function style(rules: Rules) {
  return {
    rules,

    append: (newRules: Rules) => {
      return concatRules(rules, newRules);
    },
  };
}

const seenClasses = new Set<string>();
export function cssClass(className: string, styles: Style | Rules = {}) {
  if (seenClasses.has(className)) {
    throw new Error(`Class name "${className}" has already been used.`);
  }

  seenClasses.add(className);

  const rules = {
    [`.${className}`]: styles,
  };

  return {
    className,
    rules,
    append: (newStyles: Rules) => {
      return concatRules(rules, newStyles);
    },
  };
}

function convertValue(value: string | number) {
  if (typeof value === "number") {
    if (value === 0) {
      return "0";
    }

    return `${value}px`;
  }

  return value;
}

function cssValues(...values: (string | number)[]) {
  return values.map(convertValue).join(" ");
}

export const css = {
  style,
  class: cssClass,
  values: cssValues,
};
