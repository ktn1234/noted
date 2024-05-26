import supabase from ".";

export const ProfileJoinNotesQuery = supabase
  .from("profiles")
  .select(
    `
      username,
      full_name,
      avatar_url,
      website,
      notes (id, text, created_at, updated_at, user_id)
    `
  )
  .single();

export const NotesJoinProfileQuery = supabase.from("notes").select(
  `
    id,
    text,
    created_at,
    updated_at,
    user_id,
    profiles (username, full_name, avatar_url, website)
  `
);
