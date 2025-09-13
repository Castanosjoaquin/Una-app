import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { supabase } from '@/app/src/lib/supabase'
import { createConversationWithUsers } from '@/app/src/chat/actions';
import { Ionicons } from '@expo/vector-icons';

type Conv = { id: string; title: string | null; is_group: boolean; created_at: string };

export default function Conversations() {
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
    <View style={{ flex: 1, backgroundColor: '#EFE6DA' }}>
      {/* Top bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/(tabs)/home" asChild>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="chevron-back" size={18} color="#6C2BD9" />
            <Text style={{ color: '#6C2BD9', fontWeight: '700' }}>Back to Home</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={() => router.push('/chat/new')}
          style={{ borderColor: '#FB923C', borderWidth: 1, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <Ionicons name="people-outline" size={16} color="#FB923C" />
          <Text style={{ color: '#FB923C', fontWeight: '700' }}>New Chat</Text>
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <View style={{
          backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#EEE7DB',
          paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8
        }}>
          <Ionicons name="search" size={16} color="#6B7280" />
          <TextInput
            placeholder="Search conversations…"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, color: '#111827' }}
          />
        </View>
      </View>

      {/* List / Empty */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#6C2BD9" />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/chat/${item.id}`)}
              style={{
                backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EEE7DB',
                padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <Text style={{ color: '#1F2937', fontWeight: '700' }}>{item.title ?? 'Direct message'}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function EmptyState() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="chatbubble-ellipses-outline" size={42} color="#8B6AD9" />
      <Text style={{ marginTop: 10, fontWeight: '800', color: '#6C2BD9' }}>No conversations yet</Text>
      <Text style={{ marginTop: 4, color: '#6B7280' }}>Start a new chat by selecting a user!</Text>
    </View>
  );
}
