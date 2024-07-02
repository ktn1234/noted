import { QueryData } from "@supabase/supabase-js";
import {
    NotesJoinProfileReactionsJoinProfileQuery,
    ProfileJoinNotesJoinReactionsJoinProfileQuery,
    ReactionsJoinProfileQuery,
} from "./query";

export type ProfileJoinNotesJoinReactionsJoinProfile = QueryData<
    typeof ProfileJoinNotesJoinReactionsJoinProfileQuery
>;
export type NotesJoinProfileReactionsJoinProfile = QueryData<
    typeof NotesJoinProfileReactionsJoinProfileQuery
>;
export type ReactionsJoinProfile = QueryData<typeof ReactionsJoinProfileQuery>;
