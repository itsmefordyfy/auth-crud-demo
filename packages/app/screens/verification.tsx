import { Card, View, Text } from "app/components";

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
