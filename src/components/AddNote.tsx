import { ChangeEvent } from "react";
import { Note } from "./Note";

interface AddNoteProps {
  characterLimit: number;
  notes: Note[];
  noteText: string;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setNoteText: React.Dispatch<React.SetStateAction<string>>;
  setDialogError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddNote({
  characterLimit,
  notes,
  noteText,
  setNotes,
  setNoteText,
  setDialogError,
}: AddNoteProps) {
  const handleSaveNote = () => {
    if (noteText.trim().length === 0) {
      setDialogError(true);
      return;
    }

    const date = new Date();
    const newNote: Note = {
      id: new Date().getTime().toString(),
      text: noteText,
      date: `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`,
    };
    setNotes([newNote, ...notes]);
    setNoteText("");
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52 mb-5">
      <textarea
        className="text-primary dark:text-quaternary border-none resize-none bg-tertiary dark:bg-secondary focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF]"
        rows={5}
        cols={30}
        placeholder="Type to add a note..."
        value={noteText}
        onChange={handleChange}
        maxLength={characterLimit}
      ></textarea>
      <div className="flex items-center justify-between dark:text-tertiary text-secondary">
        <small>{characterLimit - noteText.length} Remaining</small>
        <button className="save" onClick={handleSaveNote}>
          Save
        </button>
      </div>
    </div>
  );
}

export default AddNote;
