// components/EventsSection.tsx (refactor)
import React, { useCallback, useMemo, useRef } from 'react';
import { View, ScrollView, FlatList, ViewToken } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './primitives/Card';
import { Title, AppText } from './primitives/AppText';
import { Pill } from './primitives/Pill';
import { IconButton } from './primitives/IconButton';
import EventCard, { EventItem } from './EventCard';
import { useTheme } from '@/app/../theme/theme';

export default function EventsSection({
  title,
  filters,
  selectedFilter,
  onChangeFilter,
  data,
  onPressEvent,
  onToggleLike,
  onPressAdd,
}: {
  title: string;
  filters: string[];
  selectedFilter?: string;
  onChangeFilter?: (f: string) => void;
  data: EventItem[];
  onPressEvent?: (e: EventItem) => void;
  onToggleLike?: (id: string, liked: boolean) => void;
  onPressAdd?: () => void;
}) {
  const { space, colors } = useTheme();
  const keyExtractor = useCallback((e: EventItem) => e.id, []);
  const renderItem = useCallback(
    ({ item }: { item: EventItem }) => <EventCard item={item} onPress={onPressEvent} onToggleLike={onToggleLike} />,
    [onPressEvent, onToggleLike]
  );
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {}).current;
  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 50 }), []);

  return (
    <Card style={{ paddingHorizontal: space[4], paddingVertical: space[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space[2] }}>
        <Title>{title}</Title>
        <IconButton onPress={onPressAdd}>
          <Ionicons name="add" size={20} color={colors.foreground} />
        </IconButton>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: space[2], paddingVertical: 6 }}>
        {filters.map((f) => {
          const active = f === (selectedFilter ?? filters[0]);
          return <Pill key={f} label={f} active={active} onPress={() => onChangeFilter?.(f)} compact />;
        })}
      </ScrollView>

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: space[2], paddingBottom: space[1] }}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </Card>
  );
}
