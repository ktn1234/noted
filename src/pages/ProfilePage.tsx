import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { TbGhost2 } from "react-icons/tb";
import { IoNotifications } from "react-icons/io5";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import Note from "../components/Note";

import supabase from "../lib/supabase";
import { ProfileJoinNotes } from "../lib/supabase/query.types";
import { Tables } from "../lib/supabase/database.types";

function ProfilePage() {
  const { username } = useParams();
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileJoinNotes | null>(null);
  const [notes, setNotes] = useState<Tables<"notes">[]>([]);

  useMemo(() => {
    setLoading(true);
    if (!username) {
      setLoading(false);
      return;
    }

    supabase
      .from("profiles")
      .select("*, notes(*)")
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
      {profile && (
        <article className="flex flex-col items-center mt-5">
          {profile.avatar_url ? (
            <img
              className="w-16 h-16 rounded-full"
              src={profile.avatar_url}
              alt="Profile Picture"
            />
          ) : (
            <TbGhost2 className="w-16 h-16 rounded-full" size={200} />
          )}
          <section>
            <div className="mt-5 w-full">
              {user.profile?.id !== profile.id && (
                <IoNotifications
                  className="mb-2 cursor-pointer rounded-full p-1 border-2 border-tertiary text-secondary hover:bg-tertiary hover:text-primary dark:text-tertiary dark:border-secondary dark:hover:text-quaternary dark:hover:bg-secondary"
                  size="30"
                />
              )}
              <p>Username: {username}</p>
            </div>
            {profile.full_name && <p>Full Name: {profile.full_name}</p>}
            {profile.website && (
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
            )}
          </section>
          <h2 className="text-2xl text-center mt-5">Notes</h2>
          <ul className="flex flex-col gap-2 w-full md:w-[50%]">
            {notes.length > 0 ? (
              notes.map((note) => (
                <li key={note.id}>
                  {username === user.profile?.username ? (
                    <Note
                      id={note.id}
                      text={note.text}
                      date={note.created_at}
                      username={profile.username as string}
                      avatar_url={profile.avatar_url}
                      handleDeleteNote={handleDeleteNote}
                    />
                  ) : (
                    <Note
                      id={note.id}
                      text={note.text}
                      date={note.created_at}
                      username={profile.username as string}
                      avatar_url={profile.avatar_url}
                    />
                  )}
                </li>
              ))
            ) : (
              <p className="text-center">No notes found</p>
            )}
          </ul>
        </article>
      )}
    </main>
  );
}

export default ProfilePage;
