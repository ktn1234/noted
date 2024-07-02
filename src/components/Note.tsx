import { useState, useRef, useMemo } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { TbGhost2 } from "react-icons/tb";
import { GoSmiley } from "react-icons/go";
import Linkify from "linkify-react";
import EmojiPicker from "@emoji-mart/react";
import emojiMartData from "@emoji-mart/data";

import Reaction from "./Reaction";
import useAuth from "../hooks/useAuth";
import supabase from "../lib/supabase";
import { ReactionsJoinProfile } from "../lib/supabase/query.types";

interface UniqueEmojis {
  [emoji: string]: string[];
}

interface Emoji {
  id: string;
  emoticons: string[];
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

export interface NoteProps {
  id: number;
  text: string;
  date: string;
  username: string;
  avatar_url: string | null;
  handleDeleteNote?: (id: number) => void;
}

function Note({
  id,
  text,
  date,
  username,
  avatar_url,
  handleDeleteNote,
}: NoteProps) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showUsername, setShowUsername] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const navigate = useNavigate();
  const dateString = new Date(date).toLocaleString();
  const emojiReactionRef = useRef<HTMLDivElement | null>(null);

  function navigateToProfile(username: string, navigate: NavigateFunction) {
    if (window.location.pathname !== `/profiles/${username}`) {
      navigate(`/profiles/${username}`);
    }
  }

  const { data: reactions } = useQuery<
    ReactionsJoinProfile,
    PostgrestError,
    ReactionsJoinProfile
  >({
    queryKey: ["reactions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reactions")
        .select("*, profiles(username)")
        .eq("note_id", id);

      if (error) throw error;
      return data;
    },
  });

  const uniqueEmojis = useMemo(() => {
    const uniqueEmojis: UniqueEmojis = {};
    if (reactions) {
      for (let i = 0; i < reactions.length; ++i) {
        const { emoji, profiles } = reactions[i];
        if (uniqueEmojis[emoji] && profiles) {
          uniqueEmojis[emoji].push(profiles.username);
        }

        if (!uniqueEmojis[emoji] && profiles) {
          uniqueEmojis[emoji] = [profiles.username];
        }
      }
    }

    return uniqueEmojis;
  }, [reactions]);

  const { mutate } = useMutation<
    undefined,
    PostgrestError,
    { emoji: string; note_id: number; user_id: string; username: string }
  >({
    mutationFn: async ({ emoji, note_id, user_id, username }) => {
      if (uniqueEmojis[emoji] && uniqueEmojis[emoji].includes(username)) {
        const { error } = await supabase
          .from("reactions")
          .delete()
          .eq("note_id", note_id)
          .eq("emoji", emoji)
          .eq("user_id", user_id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reactions").insert({
          emoji,
          note_id,
          user_id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", id],
      });
    },
    onError: (error) => {
      console.error("[ERROR] Error inserting reaction", error);
    },
  });

  if (!user || !profile) return null;

  return (
    <article
      key={id}
      className="flex flex-col justify-between text-primary dark:text-quaternary bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52"
    >
      <Linkify
        as="div"
        options={{
          target: "_blank",
          rel: "noopener noreferrer",
          className:
            "cursor-pointer underline dark:text-quaternary hover:text-quaternary dark:hover:text-primary",
          defaultProtocol: "https",
        }}
        className="break-words flex-shrink-0 basis-32"
      >
        {text}
      </Linkify>
      <div className="flex items-start justify-between gap-3">
        <small className="whitespace-pre">{dateString}</small>
        <div className="flex items-center gap-3">
          {reactions && (
            <div className="flex flex-wrap justify-end gap-2">
              {Object.keys(uniqueEmojis).map((emoji) => {
                return (
                  <Reaction
                    key={emoji}
                    noteId={id}
                    userId={user.id}
                    emoji={emoji}
                    count={uniqueEmojis[emoji].length}
                    usernames={uniqueEmojis[emoji]}
                  />
                );
              })}
            </div>
          )}
          <div className="relative">
            {showEmojis && (
              <>
                <div
                  className={`absolute ${
                    profile.username === username
                      ? "-right-[84px]"
                      : "-right-14"
                  } sm:-right-10 bottom-10 py-2 bg-[#151617] rounded-lg`}
                >
                  <EmojiPicker
                    data={emojiMartData}
                    onEmojiSelect={(emoji: Emoji) => {
                      mutate({
                        emoji: emoji.native,
                        note_id: id,
                        user_id: user.id,
                        username: profile.username,
                      });
                      setShowEmojis(false);
                    }}
                    onClickOutside={(e: PointerEvent) => {
                      if (
                        !emojiReactionRef.current?.contains(e.target as Node)
                      ) {
                        setShowEmojis(false);
                      }
                    }}
                    maxFrequentRows={1}
                    previewPosition={"none"}
                    searchPosition={"bottom"}
                    navPosition={"none"}
                    skinTonePosition={"none"}
                  />
                </div>
                <div className="absolute bottom-7 -right-[3px] border-l-transparent border-r-transparent border-l-[16px] border-r-[16px] border-t-[16px] border-t-[#151617]"></div>
              </>
            )}
            <div ref={emojiReactionRef}>
              <GoSmiley
                className="cursor-pointer dark:hover:text-primary hover:text-quaternary"
                onClick={() => setShowEmojis(!showEmojis)}
                size={25}
              />
            </div>
          </div>
          {avatar_url ? (
            <div
              className="flex-shrink-0"
              onMouseEnter={() => setShowUsername(true)}
              onMouseLeave={() => setShowUsername(false)}
            >
              <img
                src={avatar_url}
                alt="Profile Picture"
                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-50"
                onClick={() => navigateToProfile(username, navigate)}
              />
              {showUsername && (
                <div className="absolute mt-2 p-2 rounded-md text-quaternary bg-primary dark:text-primary dark:bg-tertiary">
                  {username}
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex-shrink-0"
              onMouseEnter={() => setShowUsername(true)}
              onMouseLeave={() => setShowUsername(false)}
            >
              <TbGhost2
                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-50"
                size={200}
                onClick={() => navigateToProfile(username, navigate)}
              />
              {showUsername && (
                <div className="absolute mt-2 p-2 rounded-md text-quaternary bg-primary dark:text-primary dark:bg-tertiary">
                  {username}
                </div>
              )}
            </div>
          )}
          {handleDeleteNote && (
            <FaTrash
              className="cursor-pointer dark:hover:text-primary hover:text-quaternary flex-shrink-0"
              onClick={() => handleDeleteNote(id)}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default Note;
