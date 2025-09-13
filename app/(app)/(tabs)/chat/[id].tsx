import { useLocalSearchParams } from 'expo-router';
import React,{ useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendMessage } from '@/app/src/chat/actions';
import { useMessages } from '@/app/src/chat/useMessages';
import { supabase } from '@/app/src/lib/supabase';

export default function ChatRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, loadMore } = useMessages(id!);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

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
      style={{ flex: 1, backgroundColor: '#EFE6DA' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 80}
    >
      <FlatList
        ref={listRef}
        data={[...items].reverse()}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        onEndReached={loadMore}
        renderItem={({ item }) => (
          <Bubble mine={item.sender_id === (supabase.auth.getUser() as any)._c?.data?.user?.id} text={item.content} />
        )}
        inverted
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: '#EFE6DA' }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message…"
          placeholderTextColor="#9CA3AF"
          style={{ flex: 1, backgroundColor: '#fff', borderColor: '#EEE7DB', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color:'#111827' }}
        />
        <Pressable
          onPress={async () => {
            const txt = draft.trim();
            if (!txt) return;
            setDraft('');
            try { await sendMessage(id!, txt); } catch { setDraft(txt); }
          }}
          style={{ backgroundColor: '#6C2BD9', width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ mine, text }: { mine: boolean; text: string }) {
  return (
    <View
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        backgroundColor: mine ? '#6C2BD9' : '#FFFFFF',
        borderWidth: 1,
        borderColor: mine ? 'transparent' : '#EEE7DB',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        maxWidth: '80%',
      }}
    >
      <Text style={{ color: mine ? '#fff' : '#1F2937' }}>{text}</Text>
    </View>
  );
}
