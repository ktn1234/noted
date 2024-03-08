import { ChangeEvent } from "react";

import supabase from "../lib/supabase";
import { Tables, TablesInsert } from "../lib/supabase/types";

interface AddNoteProps {
  characterLimit: number;
  notes: Tables<"notes">[];
  noteText: string;
  setNotes: React.Dispatch<React.SetStateAction<Tables<"notes">[]>>;
  setNoteText: React.Dispatch<React.SetStateAction<string>>;
  setModalText: React.Dispatch<React.SetStateAction<string>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddNote({
  characterLimit,
  notes,
  noteText,
  setNotes,
  setNoteText,
  setModalText,
  setShowModal,
}: AddNoteProps) {
  async function handleSaveNote() {
    if (noteText.trim().length === 0) {
      setModalText("Note cannot be empty");
      setShowModal(true);
      return;
    }

    const newNote: TablesInsert<"notes"> = {
      text: noteText,
    };

    try {
      const { data: savedNotes, error } = await supabase
        .from("notes")
        .insert(newNote)
        .select()
        .returns<Tables<"notes">[]>();

      setNoteText("");

      if (error) {
        console.error("[ERROR] Error saving note", error);
        return;
      }

      setNotes([...savedNotes, ...notes]);
    } catch (error) {
      console.error("[ERROR] Error saving note", error);
    }
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (characterLimit - event.target.value.length >= 0) {
      setNoteText(event.target.value);
    }
  }

  return (
    <article className="flex flex-col justify-between bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52">
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
    </article>
  );
}

export default AddNote;
