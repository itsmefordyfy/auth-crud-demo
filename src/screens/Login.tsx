import { Button, Card, Text } from "react-native-paper";
import { FormTextInput } from "../components";
import { createFormState } from "../components";
import { loginUser } from "../auth";
import { Link } from "expo-router";

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
    <Card style={{ alignSelf: "center" }}>
      <FormTextInput label="E-mail" formState={formState} fieldName="email" />
      <FormTextInput
        label="Password"
        secureTextEntry
        formState={formState}
        fieldName="password"
      />
      <Button onPress={handleLogin}>Login</Button>
      <Text>Don't have an account yet?</Text>
      <Link href={"sign-up"}>Sign up</Link>
    </Card>
  );
}
