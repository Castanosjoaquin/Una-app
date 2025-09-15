import { useLocalSearchParams } from 'expo-router';
import React,{ useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendMessage } from '@/app/src/chat/actions';
import { useMessages } from '@/app/src/chat/useMessages';
import { supabase } from '@/app/src/lib/supabase';
import { useTheme } from '@/app/../theme/theme';

export default function ChatRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loadMore } = useMessages(id!);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);
  const { colors, space, radii } = useTheme();

  useEffect(() => {
    // opcional: marcar lectura
    (async () => {
      const me = (await supabase.auth.getUser()).data.user!;
      await supabase.from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', id!).eq('user_id', me.id);
    })();
  }, [id, items.length]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 80}
    >
      <FlatList
        ref={listRef}
        data={[...items].reverse()}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ padding: space[3], gap: space[2] }}
        onEndReached={loadMore}
        renderItem={({ item }) => (
          <Bubble mine={item.sender_id === (supabase.auth.getUser() as any)._c?.data?.user?.id} text={item.content} />
        )}
        inverted
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[2], padding: space[2], backgroundColor: colors.background }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message…"
          placeholderTextColor={colors.accent[400] || colors.primary[400]}
          style={{ flex: 1, backgroundColor: colors.input, borderColor: colors.border, borderWidth: 1, borderRadius: radii.lg, paddingHorizontal: space[3], paddingVertical: space[2], color: colors.primary.DEFAULT }}
        />
        <Pressable
          onPress={async () => {
            const txt = draft.trim();
            if (!txt) return;
            setDraft('');
            try { await sendMessage(id!, txt); } catch { setDraft(txt); }
          }}
          style={{ backgroundColor: colors.primary.DEFAULT, width: 44, height: 44, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="send" size={18} color={colors.primary.foreground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ mine, text }: { mine: boolean; text: string }) {
  const { colors, radii, space } = useTheme();
  return (
    <View
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        backgroundColor: mine ? colors.primary.DEFAULT : colors.card.DEFAULT,
        borderWidth: 1,
        borderColor: mine ? 'transparent' : colors.border,
        paddingVertical: space[2],
        paddingHorizontal: space[3],
        borderRadius: radii.lg,
        maxWidth: '80%',
      }}
    >
      <Text style={{ color: mine ? colors.primary.foreground : colors.foreground }}>{text}</Text>
    </View>
  );
}
