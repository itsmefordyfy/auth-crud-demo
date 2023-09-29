import { ActivityIndicator, Card, Text } from "react-native-paper";
import { supabaseClient } from "../supabase-client";
import { PromiseView } from "../components";
import { UserInfo } from "../auth";

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

        const metadata = user.user_metadata as DisplayUser;

        return (
          <Card>
            <Text>{`Email: ${user.email}`}</Text>
            <Text>{`First Name: ${metadata.firstName}`}</Text>
            <Text>{`Last Name: ${metadata.lastName}`}</Text>
            <Text>{`Phone: ${metadata.phoneNumber}`}</Text>
          </Card>
        );
      }}
    ></PromiseView>
  );
}
