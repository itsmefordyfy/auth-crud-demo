import { Card } from "./paper";
import { View, ViewProps } from "./native";

export function FloatingView(props: ViewProps) {
  return <View
      className="flex-1 content-center justify-center"
    >
    <Card className="self-center p-4">
    {props.children}
    </Card>
  </View>;
}
