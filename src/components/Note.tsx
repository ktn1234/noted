import { FaTrash } from "react-icons/fa";
import { TbGhost2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const dateString = new Date(date).toLocaleString();

  return (
    <article
      key={id}
      className="flex flex-col justify-between text-primary dark:text-quaternary bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52"
    >
      <span className="break-words">{text}</span>
      <div className="flex items-center justify-between">
        <small>{dateString}</small>
        <div className="flex items-center">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt="Profile Picture"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => {
                navigate(`/profiles/${username}`);
              }}
            />
          ) : (
            <TbGhost2
              className="w-8 h-8 rounded-full cursor-pointer"
              size={200}
            />
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
