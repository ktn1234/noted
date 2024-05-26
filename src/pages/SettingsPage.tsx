import { FormEvent, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import supabase from "../lib/supabase";
import { TablesInsert } from "../lib/supabase/database.types";
import LoadingPage from "./LoadingPage";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

function SettingsPage() {
  const { user, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [full_name, setFullName] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      setUsername(profile.username);
      setFullName(profile.full_name);
      setWebsite(profile.website);
      setAvatarUrl(profile.avatar_url);
    }
  }, [user, profile]);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    const profile: TablesInsert<"profiles"> = {
      username: username?.toLowerCase(),
      full_name,
      avatar_url,
      website,
    };

    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(profile)
        .select()
        .single();

      if (error) {
        console.error("[ERROR] Error updating profile:", error);
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("[ERROR] Error updating profile:", error);
    }
    setLoading(false);
  }

  if (!user) return <Navigate to="/auth" />;
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
