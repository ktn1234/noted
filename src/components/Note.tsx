import { useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { TbGhost2 } from "react-icons/tb";
import Linkify from "linkify-react";

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
  const [showUsername, setShowUsername] = useState(false);
  const navigate = useNavigate();
  const dateString = new Date(date).toLocaleString();

  function navigateToProfile(username: string, navigate: NavigateFunction) {
    if (window.location.pathname !== `/profiles/${username}`) {
      navigate(`/profiles/${username}`);
    }
  }

  return (
    <article
      key={id}
      className="flex flex-col justify-between text-primary dark:text-quaternary bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52"
    >
      <Linkify
        as="span"
        options={{
          target: "_blank",
          rel: "noopener noreferrer",
          className:
            "cursor-pointer underline dark:text-quaternary hover:text-quaternary dark:hover:text-primary",
          defaultProtocol: "https",
        }}
        className="break-words"
      >
        {text}
      </Linkify>
      <div className="flex items-center justify-between">
        <small>{dateString}</small>
        <div className="flex items-center">
          {avatar_url ? (
            <div
              onMouseEnter={() => setShowUsername(true)}
              onMouseLeave={() => setShowUsername(false)}
            >
              <img
                src={avatar_url}
                alt="Profile Picture"
                className="w-8 h-8 rounded-full cursor-pointer"
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
              onMouseEnter={() => setShowUsername(true)}
              onMouseLeave={() => setShowUsername(false)}
            >
              <TbGhost2
                className="w-8 h-8 rounded-full cursor-pointer"
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
              className="ml-3 cursor-pointer"
              onClick={() => handleDeleteNote(id)}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default Note;
