import { Button, Card, Text } from "react-native-paper";
import { FormTextInput } from "../components";
import { createFormState } from "../components";
import { loginUser } from "../auth";
import { Link } from "expo-router";
import { View } from "react-native";

export function LoginScreen() {
  const formState = createFormState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    loginUser(formState.state.email, formState.state.password)
      .then(() => {})
      .catch((_message) => {
        //todo display error in ui
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

import { StyleSheet } from "react-native";
