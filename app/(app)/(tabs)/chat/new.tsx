import React,{ useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/app/src/lib/supabase';
import { createConversationWithUsers } from '@/app/src/chat/actions';
import { useTheme } from '@/app/../theme/theme';

type Row = { id: string; username: string };

export default function NewChat() {
  const { colors, space, radii } = useTheme();
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: space[4], gap: space[3] }}>
        <Text style={{ fontWeight: '800', fontSize: 18, color: colors.foreground }}>Start a new chat</Text>
        <View style={{
          backgroundColor: colors.input, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border,
          paddingHorizontal: space[3], paddingVertical: space[2], flexDirection: 'row', alignItems: 'center', gap: space[2]
        }}>
          <TextInput
            placeholder="Search users by name…"
            placeholderTextColor={colors.accent[400] || colors.primary[400]}
            value={q}
            onChangeText={setQ}
            style={{ flex: 1, color: colors.foreground }}
            autoCapitalize="none"
          />
        </View>
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: space[2] }} color={colors.primary.DEFAULT} /> : null}

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: space[4], gap: space[2] }}
        renderItem={({ item }) => (
          <Pressable
            onPress={async () => {
              const id = await createConversationWithUsers([item.id]);
              router.replace(`/chat/${id}`);
            }}
            style={{
              backgroundColor: colors.card.DEFAULT, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border,
              padding: space[4], flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <Text style={{ color: colors.foreground }}>{item.username}</Text>
            <Text style={{ color: colors.primary.DEFAULT, fontWeight: '700' }}>Chat</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
