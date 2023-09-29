import { Text, Button, Card, ActivityIndicator } from "react-native-paper";
import { FormTextInput } from "../components";
import { createFormState } from "../components";
import { signUpUser } from "../auth";
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase-client";
import { View } from "react-native";
import { Link, router } from "expo-router";

export function SignUpScreen() {
  const formState = createFormState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    signUpUser({
      email: formState.state.email,
      firstName: formState.state.firstName,
      lastName: formState.state.lastName,
      password: formState.state.password,
      phoneNumber: formState.state.phoneNumber,
    })
      .then((_newSession) => {
        setLoading(false);
        router.replace("/verification");
      })
      .catch((e: any) => {
        setMessage(e);
        setLoading(false);
      });
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        flex: 1,
      }}
    >
      <Card style={{ alignSelf: "center", padding: 24 }}>
        <FormTextInput
          label="E-mail"
          inputMode="email"
          formState={formState}
          fieldName="email"
        />
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
          inputMode="tel"
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
        {loading && <ActivityIndicator />}
        {message && <Text style={{ color: "tomato" }}>{message}</Text>}
        <Button
          mode="contained"
          style={{
            marginHorizontal: 12,
            marginVertical: 8,
          }}
          onPress={handleCreate}
        >
          Create account
        </Button>
        <View style={{ flexDirection: "row" }}>
          <Text>Already have an account? </Text>
          <Link href={"login"} style={{ color: "tomato" }}>
            Login
          </Link>
        </View>
      </Card>
    </View>
  );
}
