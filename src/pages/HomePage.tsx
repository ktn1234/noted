import { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import Search from "../components/Search";
import AddNote from "../components/AddNote";
import LoadingIndicator from "../components/LoadingIndicator";
import Note from "../components/Note";
import Modal from "../components/Modal";

import supabase from "../lib/supabase";
import { NotesJoinProfile } from "../lib/supabase/query.types";

function HomePage(): JSX.Element {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<NotesJoinProfile>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [modalText, setModalText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    supabase
      .from("notes")
      .select("*, profiles (*)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("[ERROR] Error fetching notes", error);
        if (data) setNotes(data);
        setLoading(false);
      });
  }, []);

  async function handleRefreshNotes() {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*, profiles (*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ERROR] Error fetching notes", error);
    }

    if (data) {
      setNotes(data);
    }
    setIsRefreshing(false);
  }

  async function handleSaveNote(
    text: string,
    setText: React.Dispatch<React.SetStateAction<string>>
  ) {
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
        setText("");
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

  if (loading || !user) return <LoadingPage />;

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {!loading && !!notes.length && (
        <main className="p-3 md:p-5 flex flex-col items-center">
          <h1 className="text-2xl text-center">All Notes</h1>
          <section className="flex flex-col gap-2 w-full md:w-[50%]">
            <AddNote handleSaveNote={handleSaveNote} />
            <div className="flex justify-normal items-center mt-5">
              <span className="w-full">
                <Search handleSearch={handleSearch} />
              </span>
              <span className="mx-5">
                <IoMdRefresh
                  className={`cursor-pointer rounded-full p-1 border-2 border-tertiary text-secondary hover:bg-tertiary hover:text-primary dark:text-tertiary dark:border-secondary dark:hover:text-quaternary dark:hover:bg-secondary ${
                    isRefreshing && "animate-spin"
                  }`}
                  size="40"
                  onClick={handleRefreshNotes}
                />
              </span>
            </div>
            {isRefreshing && <LoadingIndicator className="mt-5" />}
            {!isRefreshing &&
              filteredNotes.map((note) =>
                note.profiles?.user_id === user.id ? (
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
