import { Session, User } from "@supabase/supabase-js";
import { useState, useEffect, createContext } from "react";
import supabase from "../lib/supabase";
import LoadingPage from "../pages/LoadingPage";
import { Tables } from "../lib/supabase/database.types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Tables<"profiles"> | null;
  setProfile: React.Dispatch<React.SetStateAction<Tables<"profiles"> | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  setProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
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
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) console.error("[ERROR] Error fetching profile:", error);
            if (data) {
              setProfile(data);
            }
          });
        setSession(session);
        setUser(session.user);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const value = {
    user,
    session,
    profile,
    setProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && <LoadingPage />}
    </AuthContext.Provider>
  );
}
