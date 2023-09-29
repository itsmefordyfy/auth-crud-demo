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

  if (error !== null) throw error.message;

  return data.session;
}
