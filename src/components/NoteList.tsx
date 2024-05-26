import { Tables } from "../lib/supabase/database.types";
import Note from "./Note";

interface NoteListProps {
  notes: Tables<"notes">[];
  setNotes: React.Dispatch<React.SetStateAction<Tables<"notes">[]>>;
}

function NoteList({ notes, setNotes }: NoteListProps) {
  return notes.map((note) => (
    <Note
      key={note.id}
      id={note.id}
      text={note.text}
      date={note.created_at}
      notes={notes}
      setNotes={setNotes}
    />
  ));
}

export default NoteList;
