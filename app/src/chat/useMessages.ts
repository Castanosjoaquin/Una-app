import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/app/src/lib/supabase';
import type { Message, TypingPayload, TypingState } from './types';

/* ----------------------- Mensajes (Realtime + paginado) ---------   -------------- */
export function useMessages(conversationId: string, pageSize = 30) {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [reachedEnd, setReachedEnd] = useState(false);
  const firstId = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('id', { ascending: false })
        .limit(pageSize);
      if (!alive) return;
      if (error) {
        console.warn(error);
        setLoading(false);
        return;
      }
      const arr = (data ?? []).reverse() as Message[];
      setItems(arr);
      firstId.current = arr[0]?.id ?? null;
      setReachedEnd((data?.length ?? 0) < pageSize);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [conversationId, pageSize]);

  async function loadMore() {
    if (reachedEnd || !firstId.current) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .lt('id', firstId.current)
      .order('id', { ascending: false })
      .limit(pageSize);
    if (error) return console.warn(error);
    const older = (data ?? []).reverse() as Message[];
    setItems((prev) => [...older, ...prev]);
    if (older.length > 0) firstId.current = older[0].id;
    if (older.length < pageSize) setReachedEnd(true);
  }

  // Realtime nuevos mensajes
  useEffect(() => {
    const ch = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setItems((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [conversationId]);

  return { items, loading, loadMore };
}

/* ----------------------- Presencia: typing + draft en vivo ----------------------- */
/**
 * Envía por Realtime Presence el estado "typing" y el "draft" (lo que el user escribe)
 * para que el/los otros lo vean en tiempo real.
 */
export function useTyping(conversationId: string) {
  const [meId, setMeId] = useState<string | null>(null);
  const [others, setOthers] = useState<TypingState>({});
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const draftRef = useRef<string>('');
  const sendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // obtener mi userId una vez
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMeId(data.user?.id ?? null));
  }, []);

  // crear canal presence para esta conversación
  useEffect(() => {
    const ch = supabase.channel(`presence:${conversationId}`, {
      config: { presence: { key: 'typing' } },
    });
    channelRef.current = ch;

    // sync: cuando cambia el estado de presencia, actualizamos "others"
    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState() as Record<string, TypingPayload[]>;
      const merged: TypingState = {};
      Object.values(state).forEach((arr) => {
        arr.forEach((p) => {
          if (!p?.userId || p.userId === meId) return; // me ignoro a mí
          merged[p.userId] = { typing: !!p.typing, draft: p.draft, at: p.at };
        });
      });
      setOthers(merged);
    });

    ch.subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [conversationId, meId]);

  /** Llamar al empezar a escribir */
  function startTyping() {
    sendPresence(true, draftRef.current);
  }

  /** Llamar cuando se borra/cambia el draft; hace throttle para no spamear */
  function updateDraft(next: string) {
    draftRef.current = next;
    // throttle (200ms)
    if (sendTimer.current) return;
    sendTimer.current = setTimeout(() => {
      sendTimer.current && clearTimeout(sendTimer.current);
      sendTimer.current = null;
      sendPresence(true, draftRef.current);
    }, 200);
  }

  /** Llamar al soltar el foco/enviar mensaje/dejar de tipear */
  function stopTyping() {
    sendPresence(false, '');
  }

  function sendPresence(typing: boolean, draft: string) {
    if (!channelRef.current || !meId) return;
    const payload: TypingPayload = {
      userId: meId,
      typing,
      draft: typing ? draft : '',
      at: Date.now(),
    };
    channelRef.current.track(payload);
  }

  // “otros” que están escribiendo (y sus drafts)
  const othersArray = useMemo(
    () =>
      Object.entries(others)
        .map(([userId, v]) => ({ userId, ...v }))
        .sort((a, b) => b.at - a.at),
    [others]
  );

  return {
    startTyping,
    updateDraft,
    stopTyping,
    othersTyping: othersArray, // [{ userId, typing, draft, at }]
  };
}
