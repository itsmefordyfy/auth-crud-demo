import {
  Text,
  Button,
  FloatingView,
  ActivityIndicator,
  HelperText,
  TextLink,
  FormTextInput,
  useFormState
} from "app/components";

import { useState } from "react";
import { View } from "react-native";
import { signUpUser } from "app/models";
import { useRouter } from "solito/router";
import { useClient } from "app/provider";

export function SignUpScreen() {
  const formState = useFormState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const { replace } = useRouter();
  const client = useClient();

  const [message, setMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordCheck = () => {
    if (formState.state.confirmPassword !== formState.state.password) {
      setPasswordError("Password did not match");
    } else {
      setPasswordError(null);
    }
    console.log(formState.state);
  };

  const handleCreate = () => {
    passwordCheck();
    if (passwordError !== null) return;

    if (
      formState.state.firstName.length === 0 ||
      formState.state.lastName.length === 0
    ) {
      setGeneralError("Name is empty");
    } else if (
      !/^(09[0-9]{9})$/.test(
        formState.state.phoneNumber
      )
    ) {
      setGeneralError("Invalid Phone Number");
    } else if (formState.state.email.length === 0) {
      setGeneralError("Email is empty");
    } else if (
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formState.state.email)
    ) {
      setGeneralError("Invalid Email");
    } else {
      setGeneralError(null);
    }

    if (generalError !== null) return;

    setLoading(true);
    signUpUser(client, {
      email: formState.state.email,
      firstName: formState.state.firstName,
      lastName: formState.state.lastName,
      password: formState.state.password,
      phoneNumber: formState.state.phoneNumber,
    })
      .then((_newSession) => {
        setLoading(false);
        replace("/verification");
      })
      .catch((e: any) => {
        setMessage(e);
        setLoading(false);
      });
  };

  return (
    <FloatingView>
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
        <HelperText
          type="error"
          visible={
            passwordError !== null || generalError !== null || message !== null
          }
        >
          {passwordError !== null
            ? passwordError
            : generalError !== null
            ? generalError
            : message}
        </HelperText>
        {loading && <ActivityIndicator />}

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
          <TextLink href={"login"} >
            Login
          </TextLink>
        </View>
      </FloatingView>
  );
}
