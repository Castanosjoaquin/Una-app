// components/primitives/AppText.tsx
import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '@/app/../theme/theme';
import React from 'react';

export function AppText({ style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  return (
    <RNText
      allowFontScaling
      style={[{ color: colors.foreground, fontSize: typography.sizes.body }, style]}
      {...rest}
    />
  );
}

export default AppText;

export function Title({ style, ...rest }: TextProps) {
  const { colors, typography } = useTheme();
  return (
    <RNText
      allowFontScaling
      style={[{ color: colors.foreground, fontSize: typography.sizes.title, fontWeight: '700' }, style]}
      {...rest}
    />
  );
}
