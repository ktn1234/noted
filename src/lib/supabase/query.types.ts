import { QueryData } from "@supabase/supabase-js";
import {
    NotesJoinProfileQuery,
    NotesJoinProfileSingleQuery,
    ProfileJoinNotesQuery,
} from "./query";

export type ProfileJoinNotes = QueryData<typeof ProfileJoinNotesQuery>;
export type NotesJoinProfile = QueryData<typeof NotesJoinProfileQuery>;
export type NotesJoinProfileSingle = QueryData<
    typeof NotesJoinProfileSingleQuery
>;
