import { Image } from "expo-image";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View, ViewStyle, Text, TouchableOpacity } from "react-native";
import StoryItem, { StoryUser } from "./StoryItem";

import { useTheme } from "@/app/../theme/theme";

export type StoriesBarProps = {
  data: StoryUser[];
  onPressItem?: (user: StoryUser) => void;
  style?: ViewStyle;
  itemSize?: number;
  initialNumToRender?: number;
  windowSize?: number;
  maxToRenderPerBatch?: number;
  prefetchAhead?: number;
  itemSpacing?: number;
  enablePeek?: boolean;
};

export default function StoriesBar({
  data,
  onPressItem,
  style,
  itemSize = 64,
  initialNumToRender = 8,
  windowSize = 5,
  maxToRenderPerBatch = 8,
  prefetchAhead = 6,
  itemSpacing,
  enablePeek = true,
}: StoriesBarProps) {
  const { space, colors: c, radii, typography } = useTheme();
  const effectiveItemSpacing = itemSpacing ?? space[3];
  const ITEM_WIDTH = itemSize + 16;
  const [selected, setSelected] = useState<StoryUser | null>(null);

  const keyExtractor = useCallback((u: StoryUser) => u.id, []);
  const renderItem = useCallback(
    ({ item }: { item: StoryUser }) => (
      <StoryItem
        user={item}
        size={itemSize}
        borderPercent={0.08}
        onPress={(u) => {
          if (enablePeek) setSelected(u);
          onPressItem?.(u);
        }}
      />
    ),
    [itemSize, onPressItem, enablePeek]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index }),
    [ITEM_WIDTH]
  );
  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<{ item: StoryUser; index: number | null }>; changed: any[] }) => {
      const last = [...info.viewableItems].reverse().find((v) => v.index !== null);
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
    <View style={[{ paddingVertical: space[2] }, style]}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space[2] }}
        initialNumToRender={initialNumToRender}
        maxToRenderPerBatch={maxToRenderPerBatch}
        windowSize={windowSize}
        removeClippedSubviews
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ItemSeparatorComponent={() => <View style={{ width: effectiveItemSpacing }} />}
      />

      {/* Peek card */}
      {enablePeek && selected && (
        <View
          style={{
            marginTop: space[2],
            marginHorizontal: space[2],
            backgroundColor: c.card.DEFAULT,
            borderRadius: radii.lg,
            padding: space[3],
            borderWidth: 1,
            borderColor: c.border,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={selected.avatarUrl ?? ""}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: space[2] }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.sizes.heading, fontWeight: "800", color: c.foreground }}>
                {selected.name}
              </Text>
              <Text style={{ fontSize: typography.sizes.caption, color: c.accent[400], marginTop: 2 }}>
                Tap para ver el perfil
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setSelected(null)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: c.secondary[100],
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: c.secondary[200],
              }}
              accessibilityLabel="Cerrar"
            >
              <Text style={{ color: c.foreground, fontWeight: "800" }}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", marginTop: space[2], columnGap: space[2] }}>
            <TouchableOpacity
              style={{
                backgroundColor: c.primary[600],
                paddingHorizontal: space[3],
                paddingVertical: 10,
                borderRadius: radii.md,
              }}
              onPress={() => onPressItem?.(selected)}
            >
              <Text style={{ color: c.primary.foreground, fontWeight: "700" }}>Ver perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: c.accent.DEFAULT,
                paddingHorizontal: space[3],
                paddingVertical: 10,
                borderRadius: radii.md,
              }}
            >
              <Text style={{ color: c.accent.foreground, fontWeight: "700" }}>Mensaje</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}


