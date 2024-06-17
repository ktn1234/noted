import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingPage from "./LoadingPage";

import FormInput from "../components/FormInput";
import Button from "../components/Button";

import Modal from "../components/Modal";

import supabase from "../lib/supabase";

function ResendConfirmationPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  async function handleResendConfirmationEmail(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    // This method will only resend an email or phone OTP to the user if there was an initial signup, email change or phone change request being made (https://supabase.com/docs/reference/javascript/auth-resend)
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setModalText(error.message);
      setShowModal(true);
    }

    if (!error) {
      setModalText(
        "If an account with that email exists, and it has not been verified, a confirmation email will be sent"
      );
      setShowModal(true);
    }

    setLoading(false);
  }

  if (loading) return <LoadingPage />;

  return (
    <>
      <main className="flex flex-col items-center w-full max-h-full">
        <p className="pt-3 md:pt-5 mb-5 text-xl text-center mx-5">
          {"Resend Confirmation Email"}
        </p>
        <form onSubmit={handleResendConfirmationEmail}>
          <FormInput
            label="Email"
            type="email"
            htmlFor="email"
            placeholder="user@gmail.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
            required={true}
          />
          <Button text="Resend Email" disabled={loading} />
        </form>
        <span
          className="mt-5 cursor-pointer hover:underline"
          onClick={() => navigate("/auth/signup")}
        >
          Need an account?
        </span>
        <span
          className="mt-2 cursor-pointer hover:underline"
          onClick={() => navigate("/auth")}
        >
          Already have an account?
        </span>
        <span
          className="mt-2 cursor-pointer hover:underline"
          onClick={() => navigate("/auth/verify")}
        >
          Already have an account and received a code?
        </span>
      </main>
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

export default ResendConfirmationPage;
