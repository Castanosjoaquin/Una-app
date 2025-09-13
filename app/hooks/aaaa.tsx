// // Update the path below if Account.tsx is located elsewhere
// import Account from '../../../components/Account'
// // Example: If Account.tsx is in the same folder, use:
// // import Account from './Account'
// import { supabase } from '../../../../lib/supabase'
// import { useEffect, useState } from "react";
// import { Session } from "@supabase/supabase-js";
// import React from 'react';

// export default function ProfileScreen() {
//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => setSession(data.session));
//     const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
//     return () => sub.subscription.unsubscribe();
//   }, []);

//   if (!session) return null;
//   return <Account session={session} />;
// }
