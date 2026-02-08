import { useMemo, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { GoSmiley } from "react-icons/go";
import { PiCat, PiDog } from "react-icons/pi";
import { TbGhost2 } from "react-icons/tb";
import { NavigateFunction, useNavigate } from "react-router-dom";

import emojiMartData from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Linkify from "linkify-react";

import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import supabase from "../lib/supabase";
import { ReactionsJoinProfile } from "../lib/supabase/query.types";
import Reaction from "./Reaction";

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
  reactions: ReactionsJoinProfile;
  handleDeleteNote?: (id: number) => void;
}

function Note({
  id,
  text,
  date,
  username,
  avatar_url,
  reactions: initialReactions,
  handleDeleteNote
}: NoteProps) {
  const { darkMode } = useTheme();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showUsername, setShowUsername] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const navigate = useNavigate();
  const dateString = new Date(date).toLocaleString();
  const emojiReactionRef = useRef<HTMLDivElement | null>(null);
  const [isAnimalified, setIsAnimalified] = useState(false);

  function navigateToProfile(
    username: string,
    navigate: NavigateFunction
  ): void {
    if (window.location.pathname !== `/profiles/${username}`) {
      navigate(`/profiles/${username}`);
    }
  }

  function meowify(text: string): string {
    return text
      .split(" ")
      .map((e, idx) => {
        const textDiff = e.length - 4;
        const meow = "meow" + "w".repeat(textDiff > 0 ? textDiff : 0);
        if (idx === 0) {
          return meow.charAt(0).toUpperCase() + meow.slice(1);
        }
        return meow;
      })
      .join(", ");
  }

  function woofify(text: string): string {
    return text
      .split(" ")
      .map((e, idx) => {
        const textDiff = e.length - 4;
        const woof = "woof" + "f".repeat(textDiff > 0 ? textDiff : 0);
        if (idx === 0) {
          return woof.charAt(0).toUpperCase() + woof.slice(1);
        }
        return woof;
      })
      .join(", ");
  }

  const { data: reactions } = useQuery<
    ReactionsJoinProfile,
    PostgrestError,
    ReactionsJoinProfile
  >({
    initialData: initialReactions,
    staleTime: 1000,
    queryKey: ["reactions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reactions")
        .select("*, profiles(username)")
        .eq("note_id", id);

      if (error) throw error;
      return data;
    }
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
          user_id
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", id]
      });
    },
    onError: (error) => {
      console.error("[ERROR] Error inserting reaction", error);
    }
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
          defaultProtocol: "https"
        }}
        className="break-words flex-shrink-0 basis-32"
      >
        {darkMode ? (isAnimalified ? meowify(text) : text) : null}
        {!darkMode ? (isAnimalified ? woofify(text) : text) : null}
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
                      ? "-right-[124px]"
                      : "-right-24"
                  } sm:-right-10 bottom-10 py-2 bg-[#151617] rounded-lg`}
                >
                  <EmojiPicker
                    data={emojiMartData}
                    onEmojiSelect={(emoji: Emoji) => {
                      mutate({
                        emoji: emoji.native,
                        note_id: id,
                        user_id: user.id,
                        username: profile.username
                      });
                      setShowEmojis(false);
                    }}
                    onClickOutside={(e: PointerEvent) => {
                      if (
                        !emojiReactionRef.current?.contains(e.target as Node) &&
                        document.querySelector("em-emoji-picker") !==
                          e.srcElement
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
          {darkMode ? (
            <PiCat
              className="w-7 h-7 cursor-pointer dark:hover:text-primary hover:text-quaternary"
              onClick={() => setIsAnimalified(!isAnimalified)}
            />
          ) : (
            <PiDog
              className="w-7 h-7 cursor-pointer dark:hover:text-primary hover:text-quaternary"
              onClick={() => setIsAnimalified(!isAnimalified)}
            />
          )}
          {avatar_url ? (
            <div
              className="flex-shrink-0"
              onMouseEnter={() => setShowUsername(true)}
              onMouseLeave={() => setShowUsername(false)}
              onTouchStart={() => setShowUsername(true)}
              onTouchEnd={() => setShowUsername(false)}
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
              onTouchStart={() => setShowUsername(true)}
              onTouchEnd={() => setShowUsername(false)}
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
