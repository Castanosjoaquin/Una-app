// StoriesBar.tsx
import { Image } from "expo-image";
import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, View, ViewStyle } from "react-native";
import StoryItem, { StoryUser } from "./StoryItem";

export type StoriesBarProps = {
  data: StoryUser[];
  onPressItem?: (user: StoryUser) => void;
  style?: ViewStyle;
  /** performance */
  itemSize?: number;         // debe matchear con StoryItem.size
  ringWidth?: number;
  initialNumToRender?: number;
  windowSize?: number;
  maxToRenderPerBatch?: number;
  /** prefetch próximas imágenes (N) */
  prefetchAhead?: number;
  /** Espaciado horizontal entre stories */
  itemSpacing?: number;
};

export default function StoriesBar({
  data,
  onPressItem,
  style,
  itemSize = 64,
  ringWidth = 3,
  initialNumToRender = 8,
  windowSize = 5,
  maxToRenderPerBatch = 8,
  prefetchAhead = 6,
  itemSpacing = 10,
}: StoriesBarProps) {
  const ITEM_WIDTH = 80; // coincide con StoryItem.container width

  const keyExtractor = useCallback((u: StoryUser) => u.id, []);
  const renderItem = useCallback(
    ({ item }: { item: StoryUser }) => (
      <StoryItem user={item} size={itemSize} ringWidth={ringWidth} onPress={onPressItem} borderPercent={0.04} />
    ),
    [itemSize, ringWidth, onPressItem]
  );

  // Layout fijo → scroll super fluido
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    []
  );

  // Prefetch de próximas imágenes cuando cambian los visibles
  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<{ item: StoryUser; index: number | null }>; changed: any[] }) => {
      const viewableItems = info.viewableItems;
      // Find the last item with a non-null index
      const last = [...viewableItems].reverse().find(v => v.index !== null);
      if (!last || last.index === null) return;
      const start = last.index + 1;
      const end = Math.min(start + prefetchAhead, data.length);
      for (let i = start; i < end; i++) {
        const url = data[i]?.avatarUrl;
        if (url) Image.prefetch(url);
      }
    },
    [data, prefetchAhead]
  );

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 50 }), []);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        initialNumToRender={initialNumToRender}
        maxToRenderPerBatch={maxToRenderPerBatch}
        windowSize={windowSize}
        removeClippedSubviews
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ItemSeparatorComponent={() => <View style={{ width: itemSpacing }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  content: { paddingHorizontal: 8 },
});
