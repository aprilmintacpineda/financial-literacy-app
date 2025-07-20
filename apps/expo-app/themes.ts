import { useColorScheme } from 'nativewind';

const theme = {
  '--color-white': 'rgb(255, 255, 255)',

  '--color-primary-contrast-text': 'rgb(255, 255, 255)',
  '--color-primary': 'rgb(113, 91, 100)',
  '--color-primary-border': 'rgb(113, 91, 100)',

  '--color-secondary-contrast-text': 'rgb(255, 255, 255)',
  '--color-secondary': 'rgb(91, 106, 122)',
  '--color-secondary-border': 'rgb(76, 93, 110)',

  '--color-tertiary-contrast-text': 'rgb(255, 255, 255)',
  '--color-tertiary': 'rgb(142, 126, 134)',
  '--color-tertiary-border': 'rgb(113, 91, 100)',

  '--color-error-text': 'rgb(155, 50, 50)',
  '--color-error-border': 'rgb(210, 110, 110)',
  '--color-error-bg': 'rgb(250, 235, 238)',

  '--color-info-text': 'rgb(60, 85, 110)',
  '--color-info-border': 'rgb(130, 160, 190)',
  '--color-info-bg': 'rgb(235, 245, 255)',

  '--color-warning-text': 'rgb(145, 95, 10)',
  '--color-warning-border': 'rgb(230, 180, 100)',
  '--color-warning-bg': 'rgb(255, 250, 235)',

  '--color-success-text': 'rgb(40, 100, 70)',
  '--color-success-border': 'rgb(120, 200, 160)',
  '--color-success-bg': 'rgb(235, 255, 245)',

  '--color-borders': 'rgb(210, 205, 210)',

  '--color-disabled-text': 'rgb(140, 135, 140)',
  '--color-disabled-bg': 'rgb(240, 238, 240)',
  '--color-disabled-border': 'rgb(220, 215, 220)',
};

export const themeColors = {
  dark: theme,
  light: theme,
};

export function useThemeColors () {
  const { colorScheme } = useColorScheme();
  return themeColors[colorScheme ?? 'light'];
}
