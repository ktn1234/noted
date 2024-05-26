import { QueryData } from "@supabase/supabase-js";
import { NotesJoinProfileQuery, ProfileJoinNotesQuery } from "./query";

export type ProfileJoinNotes = QueryData<typeof ProfileJoinNotesQuery>;
export type NotesJoinProfile = QueryData<typeof NotesJoinProfileQuery>;
