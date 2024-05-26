import supabase from ".";

export const ProfileJoinNotesQuery = supabase
  .from("profiles")
  .select("*, notes (*)")
  .single();

export const NotesJoinProfileQuery = supabase
  .from("notes")
  .select("*, profiles (*)");