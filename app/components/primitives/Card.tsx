// components/primitives/Card.tsx
import { View, ViewProps, Platform } from 'react-native';
import { useTheme } from '@/app/../theme/theme';
import React from 'react';

export function Card({ style, ...rest }: ViewProps) {
  const { colors, radii, space } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card.DEFAULT,
          borderRadius: radii.lg,
          paddingVertical: space[3],
          paddingHorizontal: space[3],
          ...(Platform.OS === 'android'
            ? { elevation: 2 }
            : { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12 }),
        },
        style,
      ]}
      {...rest}
    />
  );
}

export default Card;
