import { getSession } from "../src/auth";
import { HomeScreen } from "../src/screens";
import { PromiseView } from "../src/components";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <PromiseView
      promise={getSession()}
      loadedView={(session) => {
        if (session === null) {
          return <Redirect href="/login" />;
        }
        return (
          <SafeAreaView style={{ flex: 1 }}>
            <HomeScreen jwt={session.access_token} />
          </SafeAreaView>
        );
      }}
    />
  );
}
