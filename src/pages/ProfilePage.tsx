import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabase";
import LoadingPage from "./LoadingPage";
import { ProfileJoinNotes } from "../lib/supabase/query.types";
import Note from "../components/Note";
import { Tables } from "../lib/supabase/database.types";
import useAuth from "../hooks/useAuth";

function ProfilePage() {
  const { username } = useParams();
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileJoinNotes | null>(null);
  const [notes, setNotes] = useState<Tables<"notes">[]>([]);

  useEffect(() => {
    if (!username) return;

    supabase
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
      .eq("username", username)
      .order("created_at", {
        ascending: false,
        referencedTable: "notes",
      })
      .single()
      .then(({ data, error }) => {
        if (error) console.error("[ERROR] Error fetching profile:", error);
        if (data) {
          setProfile(data);
          setNotes(data.notes);
        }
        setLoading(false);
      });
  }, [username]);

  async function handleDeleteNote(id: number) {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .single();

      if (error) {
        console.error("[ERROR] Error deleting note:", error);
        return;
      }

      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("[ERROR] Error deleting note:", error);
    }
  }

  if (loading) return <LoadingPage />;

  return (
    <main className="p-3 md:p-5">
      <h1 className="text-2xl text-center">Profile</h1>
      {!profile && <p className="text-center mt-5">Profile not found</p>}
      {profile &&
        profile.avatar_url &&
        profile.full_name &&
        profile.website && (
          <article className="flex flex-col items-center mt-5">
            <img
              className="w-16 h-16 rounded-full"
              src={profile.avatar_url}
              alt="Profile Picture"
            />
            <section>
              <p className="mt-5">Username: {username}</p>
              <p>Full Name: {profile.full_name}</p>
              <p>
                Website:{" "}
                <a
                  className="hover:underline hover:text-tertiary dark:hover:text-secondary"
                  target="_blank"
                  href={profile.website}
                >
                  {profile.website}
                </a>
              </p>
            </section>
            <h2 className="text-2xl text-center mt-5">Notes</h2>
            <ul className="flex flex-col gap-2 w-full md:w-[50%]">
              {profile.notes.map((note) => (
                <li key={note.id}>
                  {username === user.profile?.username ? (
                    <Note
                      id={note.id}
                      text={note.text}
                      date={note.created_at}
                      username={profile.username}
                      avatar_url={profile.avatar_url}
                      handleDeleteNote={handleDeleteNote}
                    />
                  ) : (
                    <Note
                      id={note.id}
                      text={note.text}
                      date={note.created_at}
                      username={profile.username}
                      avatar_url={profile.avatar_url}
                    />
                  )}
                </li>
              ))}
            </ul>
          </article>
        )}
    </main>
  );
}

export default ProfilePage;
