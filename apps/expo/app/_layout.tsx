import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONNECTION_INFO } from "app/supabase-config";
import { Provider } from "app/provider";
import { Stack } from "expo-router";

export const supabaseClient = createClient(
  SUPABASE_CONNECTION_INFO.url,
  SUPABASE_CONNECTION_INFO.publickey
);

export default function Root() {
  return (
    <Provider clientProvider={() => supabaseClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
