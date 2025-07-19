/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
export default {
  tabWidth: 2,
  printWidth: 69,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  arrowParens: 'avoid',
  insertPragma: false,
  plugins: ['prettier-plugin-tailwindcss'],
};
