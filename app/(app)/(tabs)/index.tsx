// app/(tabs)/index.tsx (refactor extract)
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import CategoriesBar from '@/app/components/CategoriesBar';
import StoriesBar from '@/app/components/StoriesBar';
import EventsSection from '@/app/components/EventsSection';
import { useTheme } from '@/app/../theme/theme';
import { MOCK_EVENTS } from '@/app/components/MockEvents';
import { MOCK_USERS } from '@/app/components/MockUsers';

export default function IndexScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { colors, space } = useTheme();

  const [filter, setFilter] = useState<string>('All');
  const eventsForFilter = useMemo(
    () => MOCK_EVENTS.filter((e) => filter === 'All' || e.tags?.includes(filter)),
    [filter]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView ref={scrollRef} contentContainerStyle={{  paddingBottom: space[10] }}>
        <View style={{ marginTop: space[3]}}>
          <CategoriesBar />
          <View style ={{marginBottom: space[1], shadowColor: colors.border, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }} ></View>
          <View style={{ height: space[2] }} />
          <StoriesBar data={MOCK_USERS} itemSize={75} itemSpacing={4} />
          </View>

          <View style={{ paddingHorizontal: space[4] }}>
            <View style={{ marginTop: space[3] }}>
              <EventsSection
                title="Para vos"
                filters={['All', 'Friends']}
                selectedFilter={filter}
                onChangeFilter={setFilter}
                data={eventsForFilter}
                onPressEvent={(e) => console.log('open event', e.title)}
                onToggleLike={(id, liked) => console.log('like', id, liked)}
                onPressAdd={() => console.log('add event')}
              />
            </View>

            <View style={{ marginTop: space[3] }}>
              <EventsSection
                title="Para vos"
                filters={['All', 'Friends']}
                selectedFilter={filter}
                onChangeFilter={setFilter}
                data={eventsForFilter}
                onPressEvent={(e) => console.log('open event', e.title)}
                onToggleLike={(id, liked) => console.log('like', id, liked)}
                onPressAdd={() => console.log('add event')}
              />
            </View>
          </View>
          {/* ...repite otras secciones con el mismo patrón... */}
        
      </ScrollView>
    </View>
  );
}
