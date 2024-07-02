import { QueryData } from "@supabase/supabase-js";
import {
    NotesJoinProfileQuery,
    ProfileJoinNotesQuery,
    ReactionsJoinProfileQuery,
} from "./query";

export type ProfileJoinNotes = QueryData<typeof ProfileJoinNotesQuery>;
export type NotesJoinProfile = QueryData<typeof NotesJoinProfileQuery>;
export type ReactionsJoinProfile = QueryData<typeof ReactionsJoinProfileQuery>;
