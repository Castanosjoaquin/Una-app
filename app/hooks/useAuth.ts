import { useEffect, useState } from "react";
import { supabase } from "@/app/src/lib/supabase";

export function useAuth() {
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

  return { ready, logged };
}

export default useAuth;
