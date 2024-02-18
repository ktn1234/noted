import Note, { Note as INote } from "./Note";

interface NoteListProps {
  notes: INote[];
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>;
}

function NoteList({ notes, setNotes }: NoteListProps) {
  return notes.map((note) => (
    <Note
      id={note.id}
      text={note.text}
      date={note.date}
      notes={notes}
      setNotes={setNotes}
    />
  ));
}

export default NoteList;
