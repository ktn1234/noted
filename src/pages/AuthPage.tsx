import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import LoadingPage from "./LoadingPage";
import { Navigate } from "react-router";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Modal from "../components/Modal";

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
            <FormInput
              label="Email"
              type="email"
              htmlFor="email"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              // TODO: Fix autoComplete colors when user chooses to autocomplete email
              autoComplete="email"
            />
            <Button
              text="Send magic link"
              onClick={() => {}}
              disabled={loading}
            />
          </form>
        </div>
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
    </>
  );
}

export default AuthPage;
