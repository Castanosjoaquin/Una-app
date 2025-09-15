import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '@/app/src/lib/supabase';
import { createConversationWithUsers } from '@/app/src/chat/actions';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/../theme/theme';

type Conv = { id: string; title: string | null; is_group: boolean; created_at: string };

export default function Conversations() {
  const { colors, space, radii } = useTheme();
  const [loading, setLoading] = useState(true);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [query, setQuery] = useState('');

  // load my conversations
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, is_group, created_at')
        .order('created_at', { ascending: false });
      if (!alive) return;
      if (error) console.warn(error);
      setConvs(data ?? []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  // basic search over local (title). Para DM puedes mostrar username del otro miembro (hacer join).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return convs;
    return convs.filter(c => (c.title ?? '').toLowerCase().includes(q));
  }, [query, convs]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top bar */}
      <View style={{ paddingHorizontal: space[4], paddingVertical: space[3], flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/(tabs)/home" asChild>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: space[1] }}>
            <Ionicons name="chevron-back" size={18} color={colors.primary.DEFAULT} />
            <Text style={{ color: colors.primary.DEFAULT, fontWeight: '700' }}>Back to Home</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={() => router.push('/chat/new')}
          style={{ borderColor: colors.coral.DEFAULT, borderWidth: 1, paddingVertical: space[1], paddingHorizontal: space[3], borderRadius: radii.lg, flexDirection: 'row', alignItems: 'center', gap: space[1] }}
        >
          <Ionicons name="people-outline" size={16} color={colors.coral.DEFAULT} />
          <Text style={{ color: colors.coral.DEFAULT, fontWeight: '700' }}>New Chat</Text>
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: space[4], marginBottom: space[1] }}>
        <View style={{
          backgroundColor: colors.input, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border,
          paddingHorizontal: space[3], paddingVertical: space[2], flexDirection: 'row', alignItems: 'center', gap: space[2]
        }}>
          <Ionicons name="search" size={16} color={colors.accent[500] || colors.primary[500]} />
          <TextInput
            placeholder="Search conversations…"
            placeholderTextColor={colors.accent[400] || colors.primary[400]}
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, color: colors.foreground }}
          />
        </View>
      </View>

      {/* List / Empty */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary.DEFAULT} />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: space[4], gap: space[2] }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/chat/${item.id}`)}
              style={{
                backgroundColor: colors.card.DEFAULT, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border,
                padding: space[4], flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.foreground, fontWeight: '700' }}>{item.title ?? 'Direct message'}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.accent[400] || colors.primary[400]} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function EmptyState() {
  const { colors, space } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="chatbubble-ellipses-outline" size={42} color={colors.primary[400]} />
      <Text style={{ marginTop: space[2], fontWeight: '800', color: colors.primary.DEFAULT }}>No conversations yet</Text>
      <Text style={{ marginTop: space[1], color: colors.accent[500] || colors.primary[500] }}>Start a new chat by selecting a user!</Text>
    </View>
  );
}
