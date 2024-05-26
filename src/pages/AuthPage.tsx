import { useState } from "react";

import supabase from "../lib/supabase";

import LoadingPage from "./LoadingPage";

import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Modal from "../components/Modal";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function AuthPage() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  async function handleSendOTP(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      setModalText(error.message);
      setShowModal(true);
    } else {
      setConfirming(true);
    }
    setLoading(false);
  }

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: confirmationCode,
      type: "email",
    });

    if (error) {
      setConfirming(false);
      setModalText(error.message);
      setShowModal(true);
    }
  }

  if (session) return <Navigate to="/" />;
  if (loading) return <LoadingPage />;

  return (
    <>
      {!session && !confirming && (
        <div className="flex flex-col items-center w-full max-h-full">
          <p className="pt-3 md:pt-5 mb-5 text-xl text-center mx-5">
            {"Enter your email to receive a OTP Code to sign in"}
          </p>
          <form onSubmit={handleSendOTP}>
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
            />
            <Button text="Send Code" disabled={loading} />
          </form>
        </div>
      )}
      {!session && confirming && (
        <div className="flex flex-col items-center w-full max-h-full">
          <p className="pt-3 md:pt-5 mb-5 text-xl text-center mx-5">
            {"Enter the OTP Code sent to your email"}
          </p>
          <form onSubmit={handleConfirm}>
            <FormInput
              label="OTP"
              type="text"
              htmlFor="otp"
              placeholder="123456"
              value={confirmationCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmationCode(e.target.value)
              }
            />
            <Button text="Confirm" disabled={loading} />
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
