import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import Search from "../components/Search";
import AddNote from "../components/AddNote";
import Note from "../components/Note";

import supabase from "../lib/supabase";
import { NotesJoinProfile } from "../lib/supabase/query.types";

import Modal from "../components/Modal";

function HomePage(): JSX.Element {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<NotesJoinProfile>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [modalText, setModalText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("notes")
      .select("*, profiles (*)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("[ERROR] Error fetching notes", error);
        if (data) setNotes(data);
        setLoading(false);
      });
  }, [user]);

  async function handleSaveNote(text: string) {
    if (text.trim().length === 0) {
      setModalText("Note cannot be empty");
      setShowModal(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert({ text })
        .select("*, profiles (*)")
        .single();

      if (error) {
        console.error("[ERROR] Error saving note:", error);
        setModalText("Error saving note");
        setShowModal(true);
      }

      if (data) {
        setNotes([data, ...notes]);
      }
    } catch (error) {
      console.error("[ERROR] Error saving note", error);
    }
  }

  async function handleDeleteNote(id: number) {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .single();

      if (error) {
        console.error("[ERROR] Error deleting note:", error);
        return;
      }

      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("[ERROR] Error deleting note:", error);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  if (loading) return <LoadingPage />;

  return (
    <>
      {!loading && !!notes.length && (
        <main className="p-3 md:p-5 flex flex-col items-center">
          <h1 className="text-2xl text-center">All Notes</h1>
          <section className="flex flex-col gap-2 w-full md:w-[50%]">
            <AddNote handleSaveNote={handleSaveNote} />
            <div className="mt-5">
              <Search handleSearch={handleSearch} />
            </div>
            {notes
              .filter((note) =>
                note.text.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((note) =>
                note.profiles?.username === profile?.username ? (
                  <Note
                    key={note.id}
                    id={note.id}
                    text={note.text}
                    username={note.profiles!.username as string}
                    avatar_url={note.profiles!.avatar_url as string}
                    date={note.created_at}
                    handleDeleteNote={handleDeleteNote}
                  />
                ) : (
                  <Note
                    key={note.id}
                    id={note.id}
                    text={note.text}
                    username={note.profiles!.username as string}
                    avatar_url={note.profiles!.avatar_url as string}
                    date={note.created_at}
                  />
                )
              )}
          </section>
          {showModal && (
            <Modal
              text={modalText}
              closeModal={() => {
                setShowModal(false);
                setModalText("");
              }}
            />
          )}
        </main>
      )}
    </>
  );
}

export default HomePage;
