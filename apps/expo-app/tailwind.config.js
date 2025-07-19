/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
    colors: {
      // miscellaneous
      white: 'rgb(var(--color-white) / <alpha-value>)',

      // Primary
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      'primary-contrast-text':
        'rgb(var(--color-primary-contrast-text) / <alpha-value>)',
      'primary-border':
        'rgb(var(--color-primary-border) / <alpha-value>)',

      // Secondary
      secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      'secondary-contrast-text':
        'rgb(var(--color-secondary-contrast-text) / <alpha-value>)',
      'secondary-border':
        'rgb(var(--color-secondary-border) / <alpha-value>)',

      // Tertiary
      tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
      'tertiary-contrast-text':
        'rgb(var(--color-tertiary-contrast-text) / <alpha-value>)',
      'tertiary-border':
        'rgb(var(--color-tertiary-border) / <alpha-value>)',

      // Error
      'error-text': 'rgb(var(--color-error-text) / <alpha-value>)',
      'error-border':
        'rgb(var(--color-error-border) / <alpha-value>)',
      'error-bg': 'rgb(var(--color-error-bg) / <alpha-value>)',

      // Info
      'info-text': 'rgb(var(--color-info-text) / <alpha-value>)',
      'info-border': 'rgb(var(--color-info-border) / <alpha-value>)',
      'info-bg': 'rgb(var(--color-info-bg) / <alpha-value>)',

      // Warning
      'warning-text':
        'rgb(var(--color-warning-text) / <alpha-value>)',
      'warning-border':
        'rgb(var(--color-warning-border) / <alpha-value>)',
      'warning-bg': 'rgb(var(--color-warning-bg) / <alpha-value>)',

      // Success
      'success-text':
        'rgb(var(--color-success-text) / <alpha-value>)',
      'success-border':
        'rgb(var(--color-success-border) / <alpha-value>)',
      'success-bg': 'rgb(var(--color-success-bg) / <alpha-value>)',

      // Neutral Borders
      borders: 'rgb(var(--color-borders) / <alpha-value>)',

      'disabled-text':
        'rgb(var(--color-disabled-text) / <alpha-value>)',
      'disabled-bg': 'rgb(var(--color-disabled-bg) / <alpha-value>)',
      'disabled-border':
        'rgb(var(--color-disabled-border) / <alpha-value>)',
    },
  },
  plugins: [],
};
