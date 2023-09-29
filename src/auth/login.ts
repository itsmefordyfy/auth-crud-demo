import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabaseClient } from "../supabase-client";
import { Session } from "@supabase/supabase-js";
import { StoredSession } from ".";

export async function getSession(): Promise<Session | null> {
  const { data: sessionData } = await supabaseClient.auth.getSession();

  if (sessionData.session !== null) return sessionData.session;

  const sessionString = await AsyncStorage.getItem("session");
  if (sessionString === null) return null;

  try {
    const storedSession = JSON.parse(sessionString) as StoredSession;

    const { data: revived } = await supabaseClient.auth.setSession({
      access_token: storedSession.access_token,
      refresh_token: storedSession.refresh_token,
    });

    if (revived.session === null) return null;

    await AsyncStorage.setItem("session", JSON.stringify(revived.session));

    return (await supabaseClient.auth.getSession()).data.session;
  } catch (_e) {
    return null;
  }
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error !== null && data.session === null) {
    throw error.message;
  }

  await AsyncStorage.setItem(
    "session",
    JSON.stringify({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
    } as StoredSession)
  );
}

export async function logoutUser() {
  await supabaseClient.auth.signOut({ scope: "global" });
}
