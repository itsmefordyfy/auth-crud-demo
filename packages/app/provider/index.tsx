import { SafeArea } from "./safe-area";
import { SupabaseProvider, SupabaseProviderProps } from "./supabase-provider";
import { DefaultTheme, PaperProvider } from "react-native-paper";
export { useClient }  from "./supabase-provider";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "coral",
  },
};

type ProviderProps = SupabaseProviderProps;

export function Provider({ children, clientProvider }: ProviderProps) {
  return <PaperProvider theme={theme}>
    <SafeArea>
      <SupabaseProvider clientProvider={clientProvider}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SupabaseProvider>
    </SafeArea>
  </PaperProvider>;
}

