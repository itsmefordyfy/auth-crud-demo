import { styled } from "nativewind";
import { ButtonProps, Button as PaperButton } from "react-native-paper";

function ButtonInner(props: ButtonProps) {
  return <PaperButton mode="contained" {...props} />;
}

export const Button = styled(ButtonInner);
