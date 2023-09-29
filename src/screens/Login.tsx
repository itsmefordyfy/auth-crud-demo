import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { FormTextInput } from "../components";
import { createFormState } from "../components";
import { loginUser } from "../auth";
import { Link, router } from "expo-router";
import { View } from "react-native";
import { useState } from "react";

export function LoginScreen() {
  const formState = createFormState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    loginUser(formState.state.email, formState.state.password)
      .then(() => {
        setLoading(false);
        router.replace("/");
      })
      .catch((errorMessage) => {
        setMessage(errorMessage);
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
        <FormTextInput label="E-mail" formState={formState} fieldName="email" />
        <FormTextInput
          label="Password"
          placeholder="Password"
          secureTextEntry
          formState={formState}
          fieldName="password"
        />
        {loading && <ActivityIndicator />}
        {message && <Text style={{ color: "tomato" }}>{message}</Text>}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={{
            marginHorizontal: 12,
            marginVertical: 8,
          }}
        >
          Login
        </Button>
        <View style={{ flexDirection: "row" }}>
          <Text>Don't have an account yet? </Text>
          <Link href={"sign-up"} style={{ color: "tomato" }}>
            Sign up
          </Link>
        </View>
      </Card>
    </View>
  );
}
