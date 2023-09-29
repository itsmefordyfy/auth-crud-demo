import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { supabaseClient } from "../supabase-client";
import { PromiseView } from "../components";
import { UserInfo, logoutUser } from "../auth";
import { User } from "@supabase/supabase-js";
import { router } from "expo-router";
import { View } from "react-native";

type HomeProps = {
  jwt: string;
};

type DisplayUser = Omit<UserInfo, "password" | "email">;

export function HomeScreen({ jwt }: HomeProps) {
  const fetchUser = async () => {
    return (await supabaseClient.auth.getUser(jwt)).data.user;
  };

  return (
    <PromiseView
      promise={fetchUser()}
      loadedView={(user) => {
        if (user === null) return <ActivityIndicator />;

        return <Content user={user} />;
      }}
    ></PromiseView>
  );
}

interface ContentProps {
  user: User;
}

function Content({ user }: ContentProps) {
  const metadata = user.user_metadata as DisplayUser;

  return (
    <View
      style={{
        justifyContent: "flex-start",
        alignContent: "center",
        flex: 1,
      }}
    >
      <Card
        style={{
          alignSelf: "center",
          padding: 24,
        }}
      >
        <Text>{`Email: ${user.email}`}</Text>
        <Text>{`First Name: ${metadata.firstName}`}</Text>
        <Text>{`Last Name: ${metadata.lastName}`}</Text>
        <Text>{`Phone: ${metadata.phoneNumber}`}</Text>
        <Button
          mode="contained"
          style={{
            marginHorizontal: 12,
            marginVertical: 8,
          }}
          onPress={() => {
            logoutUser()
              .then(() => {
                router.replace("/login");
              })
              .catch(() => {});
          }}
        >
          Logout
        </Button>
      </Card>
    </View>
  );
}
