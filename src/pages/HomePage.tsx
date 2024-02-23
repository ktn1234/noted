import { useEffect, useState } from "react";

import LoadingPage from "./LoadingPage";

import Search from "../components/Search";
import AddNote from "../components/AddNote";
import NoteList from "../components/NoteList";

import supabase from "../lib/supabase";
import { Tables } from "../lib/supabase/types";
import Modal from "../components/Modal";

function HomePage(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<Tables<"notes">[]>([]);
  const [notesText, setNoteText] = useState<string>("");

  const [searchText, setSearchText] = useState<string>("");
  const [modalText, setModalText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const characterLimit = 200;

  useEffect(() => {
    supabase
      .from("notes")
      .select()
      .then(({ data, error }) => {
        if (error) console.error("[ERROR] Error fetching notes", error);
        if (data) setNotes(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading && <LoadingPage />}
      {!loading && (
        <div className="p-3 md:p-5">
          <h1 className="text-2xl text-center">Notes</h1>
          <Search setSearchText={setSearchText} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <AddNote
              characterLimit={characterLimit}
              notes={notes}
              setNotes={setNotes}
              noteText={notesText}
              setNoteText={setNoteText}
              setModalText={setModalText}
              setShowModal={setShowModal}
            />
            <NoteList
              notes={notes.filter((note) =>
                note.text.toLowerCase().includes(searchText.toLowerCase())
              )}
              setNotes={setNotes}
            />
          </div>
          {showModal && (
            <Modal
              text={modalText}
              closeModal={() => {
                setShowModal(false);
                setModalText("");
              }}
            />
          )}
        </div>
      )}
    </>
  );
}

export default HomePage;
