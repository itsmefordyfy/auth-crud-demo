import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabaseClient } from "../supabase-client";
import { StoredSession } from ".";

export type UserInfo = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export async function signUpUser({
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
}: UserInfo) {
  const { data, error } = await supabaseClient.auth.signUp({
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

  if (error !== null) throw error;
  if (
    data.session === null ||
    data.user === null ||
    data.user.email === undefined
  )
    throw "Failed to create account";

  await AsyncStorage.setItem(
    "session",
    JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    } as StoredSession)
  );

  return data.session;
}
