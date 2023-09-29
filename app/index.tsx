import { getSession } from "../src/auth";
import { HomeScreen } from "../src/screens";
import { PromiseView } from "../src/components";
import { Redirect } from "expo-router";

export default function Page() {
  return (
    <PromiseView
      promise={getSession()}
      loadedView={(session) => {
        if (session === null) {
          return <Redirect href="/login" />;
        }
        return <HomeScreen jwt={session.access_token} />;
      }}
    />
  );
}
