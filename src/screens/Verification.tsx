import { View } from "react-native";
import { Card } from "react-native-paper";
import { Text } from "react-native";

export function VerificationScreen() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        flex: 1,
      }}
    >
      <Card style={{ alignSelf: "center", padding: 24 }}>
        <Text>Confirm your email. Please check your email.</Text>
      </Card>
    </View>
  );
}
