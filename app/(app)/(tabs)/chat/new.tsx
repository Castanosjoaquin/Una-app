import React,{ useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/app/src/lib/supabase';
import { createConversationWithUsers } from '@/app/src/chat/actions';

type Row = { id: string; username: string };

export default function NewChat() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  // simple search in auth.users via PostgREST function (recomendado),
  // o si tenés tabla profiles: reemplaza por `from('profiles').select('id, username, full_name').ilike('username', `%${q}%')`
  useEffect(() => {
    const run = setTimeout(async () => {
      setLoading(true);
      let data, error;
      if (!q.trim()) {
        // Si no hay búsqueda, mostrar todos los usuarios (limit 30)
        ({ data, error } = await supabase
          .from('profiles')
          .select('id, username')
          .order('username', { ascending: true })
          .limit(30));
      } else {
        ({ data, error } = await supabase
          .from('profiles')
          .select('id, username')
          .ilike('username', `%${q}%`));
      }
      if (error) console.warn(error);
      setResults((data as any[])?.map(r => ({ id: r.id, username: r.username })) ?? []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(run);
  }, [q]);

  return (
    <View style={{ flex: 1, backgroundColor: '#EFE6DA' }}>
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontWeight: '800', fontSize: 18, color: '#1F2937' }}>Start a new chat</Text>
        <View style={{
          backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#EEE7DB',
          paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8
        }}>
          <TextInput
            placeholder="Search users by name…"
            placeholderTextColor="#9CA3AF"
            value={q}
            onChangeText={setQ}
            style={{ flex: 1, color: '#111827' }}
            autoCapitalize="none"
          />
        </View>
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 8 }} color="#6C2BD9" /> : null}

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              const id = await createConversationWithUsers([item.id]);
              router.replace(`/chat/${id}`);
            }}
            style={{
              backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EEE7DB',
              padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <Text style={{ color: '#1F2937' }}>{item.username}</Text>
            <Text style={{ color: '#6C2BD9', fontWeight: '700' }}>Chat</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
