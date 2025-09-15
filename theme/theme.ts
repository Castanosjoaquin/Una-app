// src/theme/theme.ts

import { colorsLight, colorsDark, space, radii, touch, typography, gradients, shadows } from './tokens';
import { useColorScheme } from 'react-native';


export const themeLight = {
  colors: colorsLight,
  space,
  radii,
  touch,
  typography,
  gradients,
  shadows,
};

export const themeDark = {
  colors: colorsDark,
  space,
  radii,
  touch,
  typography,
  gradients,
  shadows,
};

export const useTheme = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? themeDark : themeLight;
};
