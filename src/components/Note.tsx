import { FaTrash } from "react-icons/fa";
import { Tables } from "../lib/supabase/types";
import supabase from "../lib/supabase";

export interface NoteProps {
  id: number;
  text: string;
  date: string;
  notes: Tables<"notes">[];
  setNotes: React.Dispatch<React.SetStateAction<Tables<"notes">[]>>;
}

function Note({ id, text, date, notes, setNotes }: NoteProps) {
  async function handleDeleteNote(id: number) {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .single<Tables<"notes">>();

      if (error) {
        console.error("[ERROR] Error deleting note:", error);
        return;
      }

      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("[ERROR] Error deleting note:", error);
    }
  }

  const dateString = new Date(date).toLocaleString();

  return (
    <article
      key={id}
      className="flex flex-col justify-between text-primary dark:text-quaternary bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52"
    >
      <span className="break-words">{text}</span>
      <div className="flex items-center justify-between">
        <small>{dateString}</small>
        <FaTrash
          className="cursor-pointer"
          onClick={() => handleDeleteNote(id)}
        />
      </div>
    </article>
  );
}

export default Note;
