import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import config from "../../config";

export default createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);
