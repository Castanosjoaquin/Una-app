// src/components/GoogleSignIn.tsx
import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/src/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Completa sesiones pendientes (recomendado por Expo)
WebBrowser.maybeCompleteAuthSession();
 
export default function GoogleSignIn() {
  // (Opcional) precalienta el browser para Android
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const onPress = async () => {
    const redirectTo = makeRedirectUri({ scheme: 'unahub' }); // <-- usa tu scheme de app.json
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) {
      console.warn('Google OAuth error:', error.message);
    }
    // Al volver por deep link, completamos la sesión con exchangeCodeForSession (ver root layout)
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="logo-google" size={20} />
        <Text style={{ color: '#111827', fontWeight: '600', fontSize: 18, marginLeft: 12 }}>
          Continue with Google
        </Text>
      </View>
    </TouchableOpacity>
  );
}
