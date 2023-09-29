import { Text, Button, Card } from "react-native-paper";
import { FormTextInput } from "../components";
import { createFormState } from "../components";
import { signUpUser } from "../auth";
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase-client";

export function SignUpScreen() {
  const [session, setSession] = useState<Session | null>(null);

  const formState = createFormState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  return session !== null ? (
    <>
      <Text>Please check your email.</Text>
      <Button
        onPress={() => {
          if (session.user.email !== undefined) {
            supabaseClient.auth.resend({
              email: session.user.email,
              type: "signup",
            });
          }
        }}
      >
        Resend verification
      </Button>
    </>
  ) : (
    <>
      <Card style={{ alignSelf: "center" }}>
        <FormTextInput label="E-mail" formState={formState} fieldName="email" />
        <FormTextInput
          label="First Name"
          formState={formState}
          fieldName="firstName"
        />
        <FormTextInput
          label="Last Name"
          formState={formState}
          fieldName="lastName"
        />
        <FormTextInput
          label="Phone Number"
          formState={formState}
          fieldName="phoneNumber"
        />
        <FormTextInput
          label="Password"
          secureTextEntry
          formState={formState}
          fieldName="password"
        />
        <FormTextInput
          label="Confirm Password"
          secureTextEntry
          formState={formState}
          fieldName="confirmPassword"
        />
        <Button
          onPress={() => {
            signUpUser({
              email: formState.state.email,
              firstName: formState.state.firstName,
              lastName: formState.state.lastName,
              password: formState.state.password,
              phoneNumber: formState.state.phoneNumber,
            })
              .then((newSession) => {
                setSession(newSession);
              })
              .catch((_e: any) => {});
          }}
        >
          Create account
        </Button>
      </Card>
    </>
  );
}
