import { Session, User } from "@supabase/supabase-js";
import { useState, useEffect, createContext } from "react";
import supabase from "../lib/supabase";
import LoadingPage from "../pages/LoadingPage";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });
  }, []);

  const value = {
    user,
    session,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && <LoadingPage />}
    </AuthContext.Provider>
  );
}
