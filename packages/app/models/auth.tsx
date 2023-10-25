import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { ClientType } from "app/provider/supabase-provider";

export interface SignUpRequest {
  firstName: string,
  lastName:string,
  email: string,
  password: string,
  phoneNumber: string,
}

export interface StoredSession {
  access_token: string;
  refresh_token: string;
}

export type UserInfo = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export async function signUpUser(client: ClientType, {
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
}: SignUpRequest) {
  const { data, error } = await client.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      },
    },
  });

  if (error !== null) throw error.message;

  return data.session;
}

export async function getSession(client: ClientType): Promise<Session | null> {
  const { data: sessionData } = await client.auth.getSession();

  if (sessionData.session !== null) return sessionData.session;

  const sessionString = await AsyncStorage.getItem("session");
  if (sessionString === null) return null;

  try {
    const storedSession = JSON.parse(sessionString) as StoredSession;

    const { data: revived } = await client.auth.setSession({
      access_token: storedSession.access_token,
      refresh_token: storedSession.refresh_token,
    });

    if (revived.session === null) return null;

    await AsyncStorage.setItem("session", JSON.stringify(revived.session));

    return (await client.auth.getSession()).data.session;
  } catch (_e) {
    return null;
  }
}

export async function loginUser(client: ClientType, email: string, password: string) {
  const { data, error } = await client.auth.signInWithPassword({
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

export async function logoutUser(client: ClientType) {
  await client.auth.signOut({ scope: "global" });
}
