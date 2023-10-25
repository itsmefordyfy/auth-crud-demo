import {
  Text,
  Button,
  FloatingView,
  ActivityIndicator,
  TextLink,
  View,
  FormTextInput,
  useFormState
} from "app/components";

import { loginUser } from "app/models";
import { useClient } from "app/provider";
import { useState } from "react";
import { useRouter } from "solito/router";

export function LoginScreen() {
  const formState = useFormState({
    email: "",
    password: "",
  });

  const client = useClient();
  const { replace } = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    loginUser(client,formState.state.email, formState.state.password)
      .then(() => {
        setLoading(false);
        replace("/");
      })
      .catch((errorMessage) => {
        setMessage(errorMessage);
        setLoading(false);
      });
  };

  return (
    <FloatingView>
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
          <Text>No account yet? </Text>
          <TextLink href={"sign-up"} >
            Sign up
          </TextLink>
        </View>
    </FloatingView>
  );
}
