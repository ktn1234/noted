import supabase from ".";

export const ProfileJoinNotesJoinReactionsJoinProfileQuery = supabase
  .from("profiles")
  .select("*, notes (*, reactions(*, profiles(username)))")
  .single();

export const NotesJoinProfileReactionsJoinProfileQuery = supabase
  .from("notes")
  .select("*, profiles (*), reactions(*, profiles(username))");

export const ReactionsJoinProfileQuery = supabase
  .from("reactions")
  .select("*, profiles(username)");
