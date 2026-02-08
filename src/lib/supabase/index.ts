import { createClient } from "@supabase/supabase-js";

import config from "../../config";
import { Database } from "./database.types";

export default createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);
