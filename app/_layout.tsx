import { Provider } from "../src/provider";
import { Stack } from "expo-router";

export default function App() {
  return (
    <Provider>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
