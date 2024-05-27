import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useState } from "react";
import supabase from "../lib/supabase";
import Modal from "../components/Modal";
import LoadingPage from "./LoadingPage";

function Signup() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            username,
            full_name: fullName || undefined,
            avatar_url: avatarUrl || undefined,
            website: website || undefined,
          },
        },
      });

      if (error) {
        setModalText(error.message);
        setShowModal(true);
      }

      if (data) {
        setModalText("Check your email for a cofirmation link");
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
      <div className="flex flex-col items-center w-full max-h-full">
        <p className="pt-3 md:pt-5 mb-5 text-xl text-center mx-5">
          {"Sign Up"}
        </p>
        <form onSubmit={handleSignUp}>
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
            label="Username"
            type="text"
            htmlFor="username"
            placeholder="happycat"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            autoComplete="username"
            required={true}
          />
          <FormInput
            label="Full Name"
            type="text"
            htmlFor="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFullName(e.target.value)
            }
            autoComplete="fullName"
          />
          <FormInput
            label="Avatar URL"
            type="text"
            htmlFor="avatarUrl"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAvatarUrl(e.target.value)
            }
            autoComplete="avatarUrl"
          />
          <FormInput
            label="Website"
            type="text"
            htmlFor="website"
            placeholder="https://example.com"
            value={website}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWebsite(e.target.value)
            }
            autoComplete="website"
          />
          <Button text="Create Account" disabled={loading} />
        </form>{" "}
        <span
          className="mt-5 cursor-pointer hover:underline"
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
    </>
  );
}

export default Signup;
