import { supabase } from '@/app/src/lib/supabase';

export async function sendMessage(conversationId: string, content: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('No session');
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
  });
  if (error) throw error;
}

export async function createConversationWithUsers(userIds: string[], title?: string) {
  const me = (await supabase.auth.getUser()).data.user!;
  const { data: conv, error } = await supabase
    .from('conversations')
    .insert({ created_by: me.id, is_group: userIds.length > 1, title })
    .select()
    .single();
  if (error) throw error;

  const rows = [...new Set([me.id, ...userIds])].map((uid) => ({
    conversation_id: conv.id,
    user_id: uid,
  }));
  const { error: e2 } = await supabase.from('conversation_participants').insert(rows);
  if (e2) throw e2;

  return conv.id as string;
}

export async function markConversationRead(conversationId: string) {
  const me = (await supabase.auth.getUser()).data.user!;
  await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', me.id);
}
