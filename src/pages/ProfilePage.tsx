import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TbGhost2 } from "react-icons/tb";
import { IoNotifications, IoNotificationsOffSharp } from "react-icons/io5";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import Note from "../components/Note";

import supabase from "../lib/supabase";
import { ProfileJoinNotes } from "../lib/supabase/query.types";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const user = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileJoinNotes | null>(null);

  // State that represents if the user is subscribed to the profile's user notifications
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (!user.profile) return;
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
      .then(({ data: currentProfile, error }) => {
        if (error) {
          console.error("[ERROR] Error fetching profile:", error);
          return;
        }

        if (currentProfile && user.profile) {
          if (user.profile.username !== currentProfile.username) {
            supabase
              .from("subscriptions")
              .select("*")
              .eq("subscriber_user_id", user.profile.user_id)
              .eq("user_id", currentProfile.user_id)
              .then(({ data: subscriptions, error }) => {
                if (error) {
                  console.error("[ERROR] Error fetching subscription:", error);
                  return;
                }

                if (subscriptions && subscriptions.length === 1) {
                  setIsSubscribed(true);
                } else {
                  setIsSubscribed(false);
                }
                setProfile(currentProfile);
              });
          }
        }
        setLoading(false);
      });
  }, [username, user]);

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

      setProfile((prevProfile) => {
        if (!prevProfile) return prevProfile;
        return {
          ...prevProfile,
          notes: prevProfile.notes.filter((note) => note.id !== id),
        };
      });
    } catch (error) {
      console.error("[ERROR] Error deleting note:", error);
    }
  }

  async function subscribeToUserNotifications() {
    try {
      const { status, error } = await supabase.from("subscriptions").insert({
        subscriber_user_id: user.profile?.user_id,
        user_id: profile?.user_id,
      });

      if (error) {
        console.error(
          "[ERROR] Error subscribing to user notifications:",
          error
        );
        return;
      }

      if (status === 201) setIsSubscribed(true);
    } catch (error) {
      console.error("[ERROR] Error subscribing to user notifications:", error);
    }
  }

  async function unsubscribeToUserNotifications() {
    try {
      const { status, error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("subscriber_user_id", user.profile?.user_id as string)
        .eq("user_id", profile?.user_id as string);

      if (error) {
        console.error(
          "[ERROR] Error unsubscribing to user notifications:",
          error
        );
        return;
      }

      if (status === 204) setIsSubscribed(false);
    } catch (error) {
      console.error(
        "[ERROR] Error unsubscribing to user notifications:",
        error
      );
    }
  }

  if (loading) return <LoadingPage />;
  if (!user.profile) return <LoadingPage />;

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
              {user.profile.id !== profile.id &&
                (isSubscribed ? (
                  <IoNotificationsOffSharp
                    className="mb-2 cursor-pointer rounded-full p-1 border-2 border-tertiary text-secondary hover:bg-tertiary hover:text-primary dark:text-tertiary dark:border-secondary dark:hover:text-quaternary dark:hover:bg-secondary"
                    size="30"
                    onClick={unsubscribeToUserNotifications}
                  />
                ) : (
                  <IoNotifications
                    className="mb-2 cursor-pointer rounded-full p-1 border-2 border-tertiary text-secondary hover:bg-tertiary hover:text-primary dark:text-tertiary dark:border-secondary dark:hover:text-quaternary dark:hover:bg-secondary"
                    size="30"
                    onClick={subscribeToUserNotifications}
                  />
                ))}
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
            {profile.notes.length > 0 ? (
              profile.notes.map((note) => (
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
