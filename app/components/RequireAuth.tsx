import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { supabase } from "@/app/src/lib/supabase";
import React from "react";
import { View } from "react-native";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLogged(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLogged(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null;
  if (!logged) return <Redirect href="/(auth)/sign-in" />;
  return <View>{children}</View>;
};

export default RequireAuth;

