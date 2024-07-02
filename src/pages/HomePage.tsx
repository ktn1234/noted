import { useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import { PostgrestError } from "@supabase/supabase-js";
import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import Search from "../components/Search";
import AddNote from "../components/AddNote";
import LoadingIndicator from "../components/LoadingIndicator";
import Note from "../components/Note";
import Modal from "../components/Modal";

import supabase from "../lib/supabase";
import { NotesJoinProfileReactionsJoinProfile } from "../lib/supabase/query.types";

function HomePage(): JSX.Element {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState<string>("");
  const [modalText, setModalText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    data: notes,
    isFetching,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<
    NotesJoinProfileReactionsJoinProfile | null,
    DefaultError,
    NotesJoinProfileReactionsJoinProfile
  >({
    queryKey: ["notes"],
    initialData: [],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*, profiles (*), reactions(*, profiles(username))")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[ERROR] Error fetching notes", error);
        setModalText("Something went wrong while fetching notes...");
        setShowModal(true);
        throw error;
      }

      return data;
    },
  });

  const { mutate: saveNote } = useMutation<
    undefined,
    PostgrestError,
    { text: string; setText: React.Dispatch<React.SetStateAction<string>> }
  >({
    mutationFn: async ({ text }) => {
      const { error } = await supabase.from("notes").insert({ text }).single();
      if (error) throw error;
    },
    onSuccess: (_, { setText }) => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      setText("");
    },
    onError: (error) => {
      console.error("[ERROR] Error saving note:", error);
      setModalText(
        "Something went wrong while saving your note. Please try again."
      );
      setShowModal(true);
    },
  });

  const { mutate: deleteNote } = useMutation<
    undefined,
    PostgrestError,
    { id: number }
  >({
    mutationFn: async ({ id }) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .single();

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
    onError: (error) => {
      console.error("[ERROR] Error deleting note:", error);
      setModalText(
        "Something went wrong while deleting your node. Please try again."
      );
      setShowModal(true);
    },
  });

  async function handleSaveNote(
    text: string,
    setText: React.Dispatch<React.SetStateAction<string>>
  ) {
    if (text.trim().length === 0) {
      setModalText("Note cannot be empty");
      setShowModal(true);
      return;
    }

    saveNote({ text, setText });
  }

  async function handleDeleteNote(id: number) {
    deleteNote({ id });
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  if (isLoading || !user || (isFetching && notes.length === 0)) {
    return <LoadingPage />;
  }

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <main className="p-3 md:p-5 flex flex-col items-center">
      <h1 className="text-2xl text-center">All Notes</h1>
      {notes.length === 0 && !isFetching && (
        <section className="flex flex-col gap-2 w-full md:w-[50%]">
          <AddNote handleSaveNote={handleSaveNote} />
          <span className="mt-5 text-center">
            No notes to display. Add a note to get started!
          </span>
        </section>
      )}
      {notes.length > 0 && (
        <section className="flex flex-col gap-2 w-full md:w-[50%]">
          <AddNote handleSaveNote={handleSaveNote} />
          <div className="flex justify-normal items-center mt-5">
            <span className="w-full">
              <Search handleSearch={handleSearch} />
            </span>
            <span className="mx-5">
              <IoMdRefresh
                className={`cursor-pointer rounded-full p-1 border-2 border-tertiary text-secondary hover:bg-tertiary hover:text-primary dark:text-tertiary dark:border-secondary dark:hover:text-quaternary dark:hover:bg-secondary ${
                  isRefetching && "animate-spin"
                }`}
                size="40"
                onClick={() => refetch()}
              />
            </span>
          </div>
          {isRefetching && <LoadingIndicator className="my-5 -z-10" />}
          {filteredNotes.map((note) =>
            note.profiles?.user_id === user.id ? (
              <Note
                key={note.id}
                id={note.id}
                text={note.text}
                username={note.profiles!.username as string}
                avatar_url={note.profiles!.avatar_url as string}
                date={note.created_at}
                reactions={note.reactions}
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
                reactions={note.reactions}
              />
            )
          )}
        </section>
      )}
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
  );
}

export default HomePage;
