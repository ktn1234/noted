import { useEffect, useRef, useState } from "react";
import { FaStickyNote } from "react-icons/fa";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";

import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

import supabase from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Navbar(): JSX.Element {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [displayDropdown, setDisplayDropdown] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[ERROR] Error signing out:", error);
      return;
    }
  }

  useEffect(() => {
    function closeDropdown(event: MouseEvent) {
      if (
        displayDropdown &&
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setDisplayDropdown(false);
      }
    }

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, [displayDropdown]);

  return (
    <nav className="flex items-center justify-between">
      <div
        className="flex items-center hover:underline cursor-pointer"
        onClick={() => navigate("/")}
      >
        <FaStickyNote />
        <span className="pl-2">Noted</span>
      </div>
      <div className="flex gap-2 items-center">
        {darkMode ? (
          <MdLightMode
            onClick={toggleTheme}
            className="cursor-pointer dark:hover:text-quaternary"
            size="1.5em"
          />
        ) : (
          <MdDarkMode
            onClick={toggleTheme}
            className="cursor-pointer hover:text-secondary"
            size="1.5em"
          />
        )}

        {user && (
          <div ref={dropDownRef}>
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                onClick={() => setDisplayDropdown(!displayDropdown)}
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            )}
            {!profile?.avatar_url && (
              <IoMdPerson
                onClick={() => setDisplayDropdown(!displayDropdown)}
                className="cursor-pointer hover:text-secondary focus:text-secondary dark:hover:text-quaternary dark:focus:text-quaternary"
                size="1.5em"
              />
            )}
            {displayDropdown && (
              <menu className="absolute right-0 flex flex-col mt-2 mr-5 rounded-md bg-tertiary text-primary dark:bg-secondary dark:text-quaternary shadow-lg max-w-44">
                <ul className="py-2">
                  <li className="px-4 py-2">
                    <span className="break-words">{user.email}</span>
                  </li>
                  <li
                    className="px-4 py-2 dark:hover:text-primary hover:text-quaternary cursor-pointer"
                    onClick={() => {
                      navigate(`/profiles/${profile?.username}`);
                      setDisplayDropdown(false);
                    }}
                  >
                    <span>Profile</span>
                  </li>
                  <li
                    className="px-4 py-2 dark:hover:text-primary hover:text-quaternary cursor-pointer"
                    onClick={() => {
                      navigate("/settings");
                      setDisplayDropdown(false);
                    }}
                  >
                    <span>Settings</span>
                  </li>
                  <li
                    className="px-4 py-2 dark:hover:text-primary hover:text-quaternary cursor-pointer"
                    onClick={signOut}
                  >
                    <span>Sign out</span>
                  </li>
                </ul>
              </menu>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
