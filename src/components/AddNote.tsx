import { useState, ChangeEvent } from "react";

const CHARACTER_LIMIT = 200;

interface AddNoteProps {
  handleSaveNote: (text: string) => void;
}

function AddNote({ handleSaveNote }: AddNoteProps): JSX.Element {
  const [text, setText] = useState<string>("");

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (CHARACTER_LIMIT - event.target.value.length >= 0) {
      setText(event.target.value);
    }
  }

  return (
    <article className="flex flex-col justify-between bg-tertiary dark:bg-secondary rounded-lg p-3 md:p-5 min-h-52">
      <textarea
        className="text-primary dark:text-quaternary border-none resize-none bg-tertiary dark:bg-secondary focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF]"
        rows={5}
        cols={30}
        placeholder="Type to add a note..."
        value={text}
        onChange={handleChange}
        maxLength={CHARACTER_LIMIT}
      ></textarea>
      <div className="flex items-center justify-between dark:text-tertiary text-secondary">
        <small>{CHARACTER_LIMIT - text.length} Remaining</small>
        <button className="save" onClick={() => handleSaveNote(text)}>
          Save
        </button>
      </div>
    </article>
  );
}

export default AddNote;
