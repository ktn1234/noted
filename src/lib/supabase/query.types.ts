import { QueryData } from "@supabase/supabase-js";
import { ProfileJoinNotesQuery } from "./query";

export type ProfileJoinNotes = QueryData<typeof ProfileJoinNotesQuery>;
