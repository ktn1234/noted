import { useState } from "react";
import { useParams } from "react-router-dom";
import { TbGhost2 } from "react-icons/tb";
import { IoNotifications, IoNotificationsOffSharp } from "react-icons/io5";
import { PostgrestError } from "@supabase/supabase-js";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import Note from "../components/Note";

import supabase from "../lib/supabase";
import { ProfileJoinNotes } from "../lib/supabase/query.types";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const queryClient = useQueryClient();
  const user = useAuth();

  // State that represents if the user is subscribed to the profile's user notifications
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const {
    data: profile,
    isLoading,
    isRefetching,
  } = useQuery<
    ProfileJoinNotes | null,
    PostgrestError,
    ProfileJoinNotes | null
  >({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data: currentProfile, error } = await supabase
        .from("profiles")
        .select("*, notes(*)")
        .eq("username", username as string)
        .order("created_at", {
          ascending: false,
          referencedTable: "notes",
        })
        .single();

      if (error) {
        console.error("[ERROR] Error fetching profile:", error);
        return null;
      }

      if (
        currentProfile &&
        user.profile &&
        user.profile.username !== currentProfile.username
      ) {
        const { data: subscriptions, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("subscriber_user_id", user.profile.user_id)
          .eq("user_id", currentProfile.user_id)
          .single();

        if (error) {
          console.error("[ERROR] Error fetching subscription:", error);
          return null;
        }

        if (subscriptions) setIsSubscribed(true);
      }
      return currentProfile;
    },
  });

  const { mutate: deleteNote } = useMutation<
    undefined,
    PostgrestError,
    { id: number }
  >({
    mutationFn: async ({ id }) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .single();

      if (error) throw error;
    },
    onError: (error) => {
      console.error("[ERROR] Error deleting note:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", username],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  const { mutate: subscribeToUserNotifications } = useMutation<
    number,
    PostgrestError,
    { authUserId: string; profileUserId: string }
  >({
    mutationFn: async ({ authUserId, profileUserId }) => {
      const { status, error } = await supabase.from("subscriptions").insert({
        subscriber_user_id: authUserId,
        user_id: profileUserId,
      });
      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      if (status === 201) setIsSubscribed(true);
    },
    onError: (error) => {
      console.error("[ERROR] Error subscribing to user notifications:", error);
    },
  });

  const { mutate: unsubscribeToUserNotifications } = useMutation<
    number,
    PostgrestError,
    { authUserId: string; profileUserId: string }
  >({
    mutationFn: async ({ authUserId, profileUserId }) => {
      const { status, error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("subscriber_user_id", authUserId)
        .eq("user_id", profileUserId);
      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      if (status === 204) setIsSubscribed(false);
    },
    onError: (error) => {
      console.error(
        "[ERROR] Error unsubscribing to user notifications:",
        error
      );
    },
  });

  if (isLoading || isRefetching) return <LoadingPage />;

  return (
    <main className="p-3 md:p-5">
      <h1 className="text-2xl text-center">Profile</h1>
      {(!profile || !user.profile || !user.profile.id) && (
        <p className="text-center mt-5">Profile not found</p>
      )}
      {profile && user.profile && user.profile.id && (
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
                    onClick={() =>
                      user.profile?.user_id &&
                      unsubscribeToUserNotifications({
                        authUserId: user.profile.user_id,
                        profileUserId: profile.user_id,
                      })
                    }
                  />
                ) : (
                  <IoNotifications
                    className="mb-2 cursor-pointer rounded-full p-1 border-2 border-tertiary text-secondary hover:bg-tertiary hover:text-primary dark:text-tertiary dark:border-secondary dark:hover:text-quaternary dark:hover:bg-secondary"
                    size="30"
                    onClick={() =>
                      user.profile?.user_id &&
                      subscribeToUserNotifications({
                        authUserId: user.profile.user_id,
                        profileUserId: profile.user_id,
                      })
                    }
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
                      handleDeleteNote={(id) => deleteNote({ id })}
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
