// components/EventCard.tsx
import React, { memo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './primitives/AppText';
import { useTheme } from '@/theme/theme';

export type EventItem = {
  id: string;
  title: string;
  imageUrl: string | number;
  neighborhood?: string;
  city?: string;
  tags?: string[];
  dateLabel?: string;
  priceLabel?: string;
  liked?: boolean;
};

type Props = {
  item: EventItem;
  onPress?: (e: EventItem) => void;
  onToggleLike?: (id: string, liked: boolean) => void;
  width?: number;
  height?: number;
  radius?: number;
};

const EventCard = memo(({ item, onPress, onToggleLike, width = 260, height = 190 }: Props) => {
  const [liked, setLiked] = useState(!!item.liked);
  const { colors, radii, space, typography } = useTheme();

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    onToggleLike?.(item.id, next);
  };
  const location =
    item.neighborhood && item.city
      ? `${item.neighborhood}, ${item.city}`
      : item.neighborhood || item.city || '';

  return (
    <TouchableOpacity style={{ marginRight: space[3], width }} activeOpacity={0.8} onPress={() => onPress?.(item)}>
      <View style={{ overflow: 'hidden', height, borderRadius: radii.lg }}>
        <Image source={item.imageUrl} style={{ flex: 1, borderRadius: radii.lg }} contentFit="cover" transition={120} />

        {/* tags */}
        <View style={{ position: 'absolute', top: space[1], left: space[1], flexDirection: 'row', columnGap: 6 }}>
          {item.tags?.slice(0, 2).map((t) => (
            <View key={t} style={{ backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>
              <AppText style={{ fontSize: 11, color: colors.neutral[800], fontWeight: '700' }}>{t}</AppText>
            </View>
          ))}
        </View>

        {/* like */}
        <TouchableOpacity onPress={toggle} style={{ position: 'absolute', top: space[1], right: space[1] }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? colors.destructive.DEFAULT : colors.neutral[900]} />
          </View>
        </TouchableOpacity>

        {/* overlay inferior + info */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, backgroundColor: 'rgba(0,0,0,0.25)' }} />
        <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
          <AppText style={{ color: colors.card.DEFAULT, fontSize: typography.sizes.heading, fontWeight: '700' }}>
            {item.title}
          </AppText>
          {!!location && <AppText style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>{location}</AppText>}

          <View style={{ flexDirection: 'row', columnGap: 8, marginTop: 8 }}>
            {!!item.dateLabel && (
              <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                <AppText style={{ fontSize: 12, color: colors.neutral[800], fontWeight: '700' }}>{item.dateLabel}</AppText>
              </View>
            )}
            {!!item.priceLabel && (
              <View style={{ backgroundColor: colors.neutral[900], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                <AppText style={{ fontSize: 12, color: colors.card.DEFAULT, fontWeight: '700' }}>{item.priceLabel}</AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default EventCard;
