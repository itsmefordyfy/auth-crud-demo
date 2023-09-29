import { DefaultTheme, PaperProvider, ProviderProps } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

export function Provider({ children }: ProviderProps) {
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
