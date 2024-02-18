import { useState } from "react";

import Navbar from "../components/Navbar";
import Search from "../components/Search";
import AddNote from "../components/AddNote";
import NoteList from "../components/NoteList";
import { Note } from "../components/Note";

function Home(): JSX.Element {
  const [notesKevin, setNotesKevin] = useState<Note[]>([]);
  const [noteTextKevin, setNoteTextKevin] = useState<string>("");
  const [notesRaychelle, setNotesRaychelle] = useState<Note[]>([]);
  const [noteTextRaychelle, setNoteTextRaychelle] = useState<string>("");

  const [searchText, setSearchText] = useState<string>("");
  const [dialogError, setDialogError] = useState<boolean>(false);
  const characterLimit = 200;

  return (
    <>
      <div className="p-5 shadow-sm shadow-secondary">
        <Navbar />
      </div>
      <div className="p-3 md:p-5">
        <h1 className="text-2xl text-center">Notes</h1>
        <Search setSearchText={setSearchText} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="block text-center">Kevin</div>
            <AddNote
              characterLimit={characterLimit}
              notes={notesKevin}
              noteText={noteTextKevin}
              setNotes={setNotesKevin}
              setNoteText={setNoteTextKevin}
              setDialogError={setDialogError}
            />
            <NoteList
              notes={notesKevin.filter((note) =>
                note.text.toLowerCase().includes(searchText.toLowerCase())
              )}
              setNotes={setNotesKevin}
            />
          </div>
          <div>
            <div className="block text-center">Raychelle</div>
            <AddNote
              characterLimit={characterLimit}
              noteText={noteTextRaychelle}
              notes={notesRaychelle}
              setNotes={setNotesRaychelle}
              setNoteText={setNoteTextRaychelle}
              setDialogError={setDialogError}
            />
            <NoteList
              notes={notesRaychelle.filter((note) =>
                note.text.toLowerCase().includes(searchText.toLowerCase())
              )}
              setNotes={setNotesRaychelle}
            />
          </div>
        </div>
        {dialogError && (
          <div className="fixed flex justify-center items-center w-full max-h-full inset-0 z-50">
            <div
              className="flex flex-col justify-between bg-quaternary p-5 text-center rounded-lg h-28"
              onClick={() => setDialogError(false)}
            >
              <span>Note cannot be empty </span>
              <button className="rounded bg-secondary text-tertiary">
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
