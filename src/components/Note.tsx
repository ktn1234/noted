import { FaTrash } from "react-icons/fa";

export interface Note {
  id: string;
  text: string;
  date: string;
}

export interface NoteProps {
  id: string;
  text: string;
  date: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

function Note({ id, text, date, notes, setNotes }: NoteProps) {
  const handleDeleteNote = (id: string) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  return (
    <div
      key={id}
      className="flex flex-col justify-between text-primary dark:text-quaternary bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52 mb-5"
    >
      <span className="break-words">{text}</span>
      <div className="flex items-center justify-between">
        <small>{date}</small>
        <FaTrash
          className="cursor-pointer"
          onClick={() => handleDeleteNote(id)}
        />
      </div>
    </div>
  );
}

export default Note;
