// components/primitives/IconButton.tsx
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/../theme/theme';
import React from 'react';
export function IconButton({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.card.DEFAULT,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;
