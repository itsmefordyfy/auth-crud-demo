import { createClient } from "@supabase/supabase-js";

// const SUPABASE_CONNECTION_INFO = {
//   url: `https://${process.env.SUPABASE_REF_ID}-domain.com`,
//   key: `${process.env.SUPABASE_PUB_KEY}`,
// };
const SUPABASE_CONNECTION_INFO = {
  url: "https://bafjoakbylnnuyfjbggj.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZmpvYWtieWxubnV5ZmpiZ2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5NTkzNDgsImV4cCI6MjAxMTUzNTM0OH0.dp-WDCe5Xt2WtnKyRl_D3A02Nx_tPL9sNI7nSJFslKU",
};

export const supabaseClient = createClient(
  SUPABASE_CONNECTION_INFO.url,
  SUPABASE_CONNECTION_INFO.key
);
