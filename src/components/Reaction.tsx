import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import supabase from "../lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import useAuth from "../hooks/useAuth";

interface ReactionProps {
  noteId: number;
  userId: string;
  emoji: string;
  count: number;
  usernames: string[];
}

function Reaction({ noteId, userId, emoji, count, usernames }: ReactionProps) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [showReactors, setShowReactors] = useState(false);

  const reactorsText = usernames.reduce((prev, curr, idx, self) => {
    if (idx === 0) {
      return curr;
    }
    if (idx === self.length - 1) {
      return `${prev}, and ${curr}`;
    }
    return `${prev}, ${curr}`;
  }, "");

  const { mutate: deleteReaction } = useMutation<
    undefined,
    PostgrestError,
    { noteId: number; emoji: string; userId: string }
  >({
    mutationFn: async () => {
      const { error } = await supabase
        .from("reactions")
        .delete()
        .eq("note_id", noteId)
        .eq("emoji", emoji)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onError: (error) => {
      console.error("[ERROR] Error deleting reaction", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", noteId],
      });
    },
  });

  const { mutate: addReaction } = useMutation<
    undefined,
    PostgrestError,
    { emoji: string; note_id: number; user_id: string }
  >({
    mutationFn: async () => {
      const { error } = await supabase.from("reactions").insert({
        emoji,
        note_id: noteId,
        user_id: userId,
      });

      if (error) throw error;
    },
    onError: (error) => {
      console.error("[ERROR] Error inserting reaction", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", noteId],
      });
    },
  });

  return (
    <>
      <div
        onMouseEnter={() => setShowReactors(true)}
        onMouseLeave={() => setShowReactors(false)}
        className="relative"
      >
        {showReactors && (
          <>
            <div className="absolute p-1 rounded-lg text-center bg-secondary text-quaternary dark:bg-primary w-32 bottom-10 -right-1/2 z-10">
              {`${reactorsText} reacted with ${emoji}`}
            </div>
            <div className="absolute bottom-8 -right-[3px] border-l-transparent border-r-transparent border-l-[16px] border-r-[16px] border-t-[16px] border-t-secondary dark:border-t-primary"></div>
          </>
        )}
        <div
          className={`flex ${
            profile &&
            usernames.includes(profile.username) &&
            " border-2 border-quaternary"
          } hover:opacity-50 dark:hover:opacity-50 cursor-pointer bg-secondary dark:bg-primary text-quaternary rounded-lg px-1.5 pt-1 text-left`}
          onClick={() => {
            if (profile && usernames.includes(profile.username)) {
              deleteReaction({ noteId, emoji, userId });
            }

            if (profile && !usernames.includes(profile.username)) {
              addReaction({
                emoji,
                note_id: noteId,
                user_id: userId,
              });
            }
          }}
        >
          {emoji} {count}
        </div>
      </div>
    </>
  );
}

export default Reaction;
