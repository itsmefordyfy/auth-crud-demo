import { ReactNode, useEffect, useState } from "react";
import { getSession } from "../src/auth";
import { HomeScreen, LoginScreen } from "../src/screens";
import { Session } from "@supabase/supabase-js";
import { ActivityIndicator } from "react-native-paper";
import { PromiseView } from "../src/components";

export default function Page() {
  return (
    <PromiseView
      promise={getSession()}
      loadedView={(session) => {
        return session === null ? (
          <LoginScreen />
        ) : (
          <HomeScreen jwt={session.access_token} />
        );
      }}
    />
  );
}
