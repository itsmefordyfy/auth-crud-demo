import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_CONNECTION_INFO = {
  url: "https://hotjfoodwumwghexhcqg.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdGpmb29kd3Vtd2doZXhoY3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMzkxMzYsImV4cCI6MjAxMTkxNTEzNn0.iAKeWl876vKSFLy9ELWatRbPsVOh2S8UPLE3-6klilI",
};

export const supabaseClient = createClient(
  SUPABASE_CONNECTION_INFO.url,
  SUPABASE_CONNECTION_INFO.key
);
