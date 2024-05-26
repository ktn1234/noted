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
