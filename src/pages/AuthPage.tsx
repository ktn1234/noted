import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import LoadingPage from "./LoadingPage";
import { Navigate } from "react-router";

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setModalText(error.message);
      setShowModal(true);
    } else {
      setModalText("Magic link sent. Please check your email.");
      setShowModal(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitLoading(false);
    });
  }, []);

  if (initLoading) return <LoadingPage />;

  return (
    <>
      {loading && <LoadingPage />}
      {session && <Navigate to="/" />}
      {!session && (
        <div className="flex flex-col items-center w-full max-h-full">
          <p className="pt-3 md:pt-5 mb-5 text-xl text-center mx-5">
            {"Enter your email to receive a magic link (OTP)"}
          </p>
          <form onSubmit={handleLogin}>
            <div className="flex items-center bg-tertiary dark:bg-secondary rounded-md p-2 mb-5">
              <input
                className="bg-tertiary dark:bg-secondary text-primary dark:text-quaternary w-full border-none focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF]"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />
            </div>
            <button
              className="rounded-md p-2 bg-tertiary dark:bg-secondary text-primary dark:text-quaternary w-full border-none focus:outline-none placeholder:text-gray-500 dark:placeholder:text-[#9CA3AF] dark:hover:bg-tertiary dark:hover:text-primary hover:bg-primary hover:text-quaternary transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              Send magic link
            </button>
          </form>
        </div>
      )}
      {showModal && (
        <div className="fixed flex justify-center items-center w-full max-h-full inset-0 z-50">
          <div className="mx-5 flex flex-col justify-between bg-primary dark:bg-quaternary p-5 text-center rounded-lg min-h-28 max-w-96">
            <span className="text-quaternary dark:text-primary">
              {modalText}
            </span>
            <button
              className="rounded bg-tertiary dark:bg-secondary text-primary dark:text-quaternary dark:hover:bg-tertiary dark:hover:text-primary hover:bg-primary hover:text-quaternary transition-all duration-300 ease-in-out"
              onClick={() => {
                setShowModal(false);
                setModalText("");
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthPage;
