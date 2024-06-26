import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Modal from "../components/Modal";

import supabase from "../lib/supabase";

function AuthPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  async function handleSendOTP(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
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
    } catch (error) {
      setModalText((error as Error).message);
      setShowModal(true);
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
        <main className="flex flex-col items-center w-full max-h-full">
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
              required={true}
              autoFocus={true}
            />
            <Button text="Send Code" disabled={loading} />
          </form>
          <span
            className="mt-5 cursor-pointer hover:underline"
            onClick={() => navigate("/auth/verify")}
          >
            Already have a code?
          </span>
          {/* <span
            className="mt-2 cursor-pointer hover:underline"
            onClick={() => navigate("/auth/signup")}
          >
            Need an account?
          </span> */}
        </main>
      )}
      {!session && confirming && (
        <main className="flex flex-col items-center w-full max-h-full">
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
              required={true}
              autoFocus={true}
            />
            <Button text="Confirm" disabled={loading} />
          </form>
        </main>
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
