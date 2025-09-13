import CategoriesBar from '../../components/CategoriesBar';
import StoriesBar from '@/app/components/StoriesBar'; 
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import EventsSection from '@/app/components/EventsSection';

import { MOCK_EVENTS } from '@/app/components/MockEvents';
import { MOCK_USERS } from '@/app/components/MockUsers';



export default function IndexScreen() {
  const scrollRef = useRef<ScrollView>(null);
  // Filtros (pueden venir de Redux/Zustand luego)
  const [filter, setFilter] = useState<string>("All");
  const eventsForFilter = useMemo(
    () => MOCK_EVENTS.filter(e => filter === "All" || e.tags?.includes(filter)),
    [filter]
  );
  
  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll}>
        {/* Header */}

        {/* Stories + filtros de categorías */}
        <View style={styles.block}>
          <CategoriesBar />
          <View style={{ height: 10 }} />
          <StoriesBar data={MOCK_USERS} itemSize={75} ringWidth={6} itemSpacing={16} />
        </View>

        {/* Sección de eventos */}
        <View style={styles.block}>
          <EventsSection
            title="Para vos"
            filters={["All", "Friends"]}
            selectedFilter={filter}
            onChangeFilter={setFilter}
            data={eventsForFilter}
            onPressEvent={(e) => console.log("open event", e.title)}
            onToggleLike={(id, liked) => console.log("like", id, liked)}
            onPressAdd={() => console.log("add event")}
          />
        </View>
        
        <View style={styles.block}>
          <EventsSection
            title="Coffee time"
            filters={["All", "Friends"]}
            selectedFilter={filter}
            onChangeFilter={setFilter}
            data={eventsForFilter}
            onPressEvent={(e) => console.log("open event", e.title)}
            onToggleLike={(id, liked) => console.log("like", id, liked)}
            onPressAdd={() => console.log("add event")}
          />
        </View>
              
        <View style={styles.block}>
          <EventsSection
            title="The una app"
            filters={["All", "Arte"]}
            selectedFilter={filter}
            onChangeFilter={setFilter}
            data={eventsForFilter}
            onPressEvent={(e) => console.log("open event", e.title)}
            onToggleLike={(id, liked) => console.log("like", id, liked)}
            onPressAdd={() => console.log("add event")}
          />
        </View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0136" },
  scroll: { padding: 16, paddingBottom: 40 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111827" },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  block: { marginTop: 12 },
});
