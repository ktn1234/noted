import { FormEvent, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

import useAuth from "../hooks/useAuth";

import supabase from "../lib/supabase";
import { TablesInsert } from "../lib/supabase/types";
import LoadingPage from "./LoadingPage";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

function SettingsPage() {
  const { user } = useAuth() as { user: Session["user"] }; // Only use type assertion if component is wrapped inside Protected component
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [full_name, setFullName] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`username, full_name, website, avatar_url`)
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("[ERROR] Error getting profile:", error);
        }

        if (data) {
          setUsername(data.username);
          setFullName(data.full_name);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error("[ERROR] Error getting profile:", error);
      }
      setLoading(false);
    }

    getProfile();
  }, []);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // setLoading(true);

    const profile: TablesInsert<"profiles"> = {
      id: user.id,
      username,
      full_name,
      avatar_url,
      website,
    };

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert<TablesInsert<"profiles">>(profile);

      if (error) {
        console.error("[ERROR] Error updating profile:", error);
      }
    } catch (error) {
      console.error("[ERROR] Error updating profile:", error);
    }
    // setLoading(false);

    // TODO: Refactor how to refresh the avatar in the Navbar using AuthContext (will have to put profile info in the AuthContext)
    window.location.reload();
  }

  if (loading) return <LoadingPage />;

  return (
    <div className="p-3 md:p-5">
      <h1 className="text-2xl text-center">Settings</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3 "
        onSubmit={updateProfile}
      >
        <FormInput
          htmlFor="email"
          label="Email"
          type="text"
          value={user.email}
          disabled
        />
        <FormInput
          htmlFor="username"
          label="Username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <FormInput
          htmlFor="fullName"
          label="Full Name"
          type="text"
          value={full_name || ""}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <FormInput
          htmlFor="website"
          label="Website"
          type="text"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          required
        />
        <FormInput
          htmlFor="avatarUrl"
          label="Avatar URL"
          type="text"
          value={avatar_url || ""}
          onChange={(e) => setAvatarUrl(e.target.value)}
          required
        />
        <div className="md:col-span-2 lg:col-span-3 ">
          <Button text="Update" disabled={loading} />
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
