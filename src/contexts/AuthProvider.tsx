import { User, Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { Tables } from "../lib/supabase/database.types";
import LoadingPage from "../pages/LoadingPage";
import { AuthContext } from "./AuthContext";

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

export default AuthProvider;
