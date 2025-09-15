// components/primitives/Pill.tsx
import { TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/app/../theme/theme';
import React from 'react';
export function Pill({
  label,
  active,
  onPress,
  compact = false,
  size = 'md', // 'sm' | 'md' | 'lg'
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { colors, space } = useTheme();
  const bg = active ? colors.foreground : colors.accent.DEFAULT;
  const fg = active ? colors.card.DEFAULT : colors.accent.foreground;

  // Tamaños predefinidos
  const sizeMap = {
    sm: { paddingH: 8, paddingV: 4, fontSize: 11 },
    md: { paddingH: 12, paddingV: 8, fontSize: 12 },
    lg: { paddingH: 16, paddingV: 12, fontSize: 14 },
  };
  const s = sizeMap[size] || sizeMap.md;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={{
          paddingHorizontal: compact ? 10 : s.paddingH,
          paddingVertical: compact ? 6 : s.paddingV,
          borderRadius: 999,
          backgroundColor: bg,
        }}
      >
        <AppText style={{ color: fg, fontWeight: '700', fontSize: s.fontSize }}>{label}</AppText>
      </View>
    </TouchableOpacity>
  );
}

export default Pill;
