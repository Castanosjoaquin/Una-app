import { Slot } from "expo-router";
import React,{ useEffect  } from "react";
import { AppState,View } from "react-native";
import { supabase } from './src/lib/supabase'
import "react-native-url-polyfill/auto";
import { ThemeProvider } from "../theme/provider";

// Si alguna lib lo necesita: import 'react-native-get-random-values';

export default function RootLayout() {
  // ⬇️ TU SNIPPET de auto-refresh, registrado UNA SOLA VEZ
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
    // arranca la primera vez por si la app ya está activa
    supabase.auth.startAutoRefresh();
    return () => {
      supabase.auth.stopAutoRefresh();
      sub.remove();
    };
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#EFE6DA' }}><Slot/></View>;
}
  