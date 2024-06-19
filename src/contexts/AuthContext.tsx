import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";

import { Tables } from "../lib/supabase/database.types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Tables<"profiles"> | null;
  setProfile: React.Dispatch<React.SetStateAction<Tables<"profiles"> | null>>;
  isSignedIn: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  setProfile: () => {},
  isSignedIn: false,
});
