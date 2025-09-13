import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

const supabaseUrl = 'https://bbvkzvsskuntasjfbdww.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidmt6dnNza3VudGFzamZiZHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzI4OTIsImV4cCI6MjA3MjYwODg5Mn0.fjILclmQKIoZIe_Q7nSdhGpXZjD4Zd_9ef38nwpXgbg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: { params: { eventsPerSecond: 5 } },
})