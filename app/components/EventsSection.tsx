import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ViewToken, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EventCard, { EventItem } from "./EventCard";

export type EventsSectionProps = {
  title: string;
  filters: string[];               // p.ej. ["All","Friends"]
  selectedFilter?: string;
  onChangeFilter?: (f: string) => void;

  data: EventItem[];               // eventos (ya filtrados o no)
  onPressEvent?: (e: EventItem) => void;
  onToggleLike?: (id: string, liked: boolean) => void;

  onPressAdd?: () => void;         // botón "+"
};

export default function EventsSection({
  title,
  filters,
  selectedFilter,
  onChangeFilter,
  data,
  onPressEvent,
  onToggleLike,
  onPressAdd,
}: EventsSectionProps) {
  const keyExtractor = useCallback((e: EventItem) => e.id, []);
  const renderItem = useCallback(
    ({ item }: { item: EventItem }) => <EventCard item={item} onPress={onPressEvent} onToggleLike={onToggleLike} />,
    [onPressEvent, onToggleLike]
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    // hook para prefetch/analytics si querés
  }).current;

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 50 }), []);

  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onPressAdd} style={styles.addBtn} accessibilityLabel="Add event">
          <Ionicons name="add" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
        {filters.map((f) => {
          const active = f === (selectedFilter ?? filters[0]);
          return (
            <TouchableOpacity key={f} onPress={() => onChangeFilter?.(f)} style={[styles.filterPill, active && styles.filterPillActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* lista horizontal de eventos */}
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventsContent}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "800", color: "#111827" },
  addBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },

  filtersRow: { paddingVertical: 6, columnGap: 8 },
  filterPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#F3F4F6" },
  filterPillActive: { backgroundColor: "#111827" },
  filterText: { fontSize: 12, color: "#374151", fontWeight: "700" },
  filterTextActive: { color: "white" },

  eventsContent: { paddingTop: 8, paddingBottom: 4 },
});
