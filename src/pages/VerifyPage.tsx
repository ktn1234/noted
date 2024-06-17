import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import LoadingPage from "./LoadingPage";

import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Modal from "../components/Modal";

import supabase from "../lib/supabase";

function VerifyPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: confirmationCode,
        type: "email",
      });

      if (error) {
        setModalText(error.message);
        setShowModal(true);
      }
    } catch (error) {
      setModalText((error as Error).message);
      setShowModal(true);
    }

    setLoading(false);
  }

  if (session) return <Navigate to="/" />;
  if (loading) return <LoadingPage />;

  return (
    <>
      <main className="flex flex-col items-center w-full max-h-full">
        <p className="pt-3 md:pt-5 mb-5 text-xl text-center mx-5">
          {"Enter your email and the OTP Code sent to your email"}
        </p>
        <form onSubmit={handleConfirm}>
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
          />
          <Button text="Confirm" disabled={loading} />
        </form>
        <span
          className="mt-5 cursor-pointer hover:underline"
          onClick={() => navigate("/auth")}
        >
          Didn't receive a code yet?
        </span>
        {/* <span
          className="mt-2 cursor-pointer hover:underline"
          onClick={() => navigate("/auth/signup")}
        >
          Need an account?
        </span> */}
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

export default VerifyPage;
