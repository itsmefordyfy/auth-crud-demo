import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import { supabaseClient } from "../supabase-client";
import { PromiseView } from "../components";
import { UserInfo, logoutUser } from "../auth";
import { User } from "@supabase/supabase-js";
import { router } from "expo-router";
import { FlatList, View, TextInput as TextInputRef } from "react-native";
import { createRef, useState } from "react";

type HomeProps = {
  jwt: string;
};

type DisplayUser = Omit<UserInfo, "password" | "email">;

export function HomeScreen({ jwt }: HomeProps) {
  const fetchUser = async () => {
    return (await supabaseClient.auth.getUser(jwt)).data.user;
  };

  return (
    <PromiseView
      promise={fetchUser()}
      loadedView={(user) => {
        if (user === null) return <ActivityIndicator />;

        return <Content user={user} />;
      }}
    ></PromiseView>
  );
}

interface ContentProps {
  user: User;
}

function Content({ user }: ContentProps) {
  const metadata = user.user_metadata as DisplayUser;

  return (
    <View
      style={{
        justifyContent: "flex-start",
        alignContent: "center",
        flex: 1,
      }}
    >
      <Card
        style={{
          alignSelf: "center",
          padding: 24,
        }}
      >
        <Text>{`Email: ${user.email}`}</Text>
        <Text>{`First Name: ${metadata.firstName}`}</Text>
        <Text>{`Last Name: ${metadata.lastName}`}</Text>
        <Text>{`Phone: ${metadata.phoneNumber}`}</Text>
        <Button
          mode="contained"
          style={{
            marginHorizontal: 12,
            marginVertical: 8,
          }}
          onPress={() => {
            logoutUser()
              .then(() => {
                router.replace("/login");
              })
              .catch(() => {});
          }}
        >
          Logout
        </Button>
      </Card>
      <PostViewer user={user} />
    </View>
  );
}

function PostViewer({ user }: ContentProps) {
  const getPosts = async () => {
    return (await supabaseClient.from("Post").select()).data as {
      id: string;
      text: string;
    }[];
  };

  const [refreshFlag, setRefreshFlag] = useState(false);
  const [text, setText] = useState("");
  const textRef = createRef<TextInputRef>();

  const addPost = async () => {
    await supabaseClient.from("Post").insert({
      author: user.id,
      text: text,
    });

    textRef.current?.clear();
  };

  const removePost = async (id: string) => {
    await supabaseClient.from("Post").delete().eq("id", id);
  };

  return (
    <PromiseView
      promise={getPosts()}
      refreshFlag={refreshFlag}
      loadingView={<ActivityIndicator />}
      loadedView={(data) => (
        <FlatList
          style={{
            margin: 24,
          }}
          data={data}
          renderItem={({ item }) => {
            return (
              <Card
                key={item.id}
                style={{
                  alignSelf: "center",
                  width: 300,
                  height: 96,
                  padding: 16,
                  margin: 16,
                }}
              >
                <Text>{item.text}</Text>
                <IconButton
                  icon="trash-can"
                  mode="contained"
                  size={20}
                  onPress={() => {
                    removePost(item.id).then(() => {
                      setRefreshFlag(!refreshFlag);
                    });
                  }}
                />
              </Card>
            );
          }}
          ListFooterComponent={
            <Card
              style={{
                alignSelf: "center",
                width: 300,
                height: 150,
                padding: 16,
              }}
            >
              <TextInput
                ref={textRef}
                mode="outlined"
                multiline
                style={{ flex: 1 }}
                onChangeText={(inputText) => setText(inputText)}
              />
              <IconButton
                icon="shape-rectangle-plus"
                mode="contained"
                size={20}
                onPress={() => {
                  addPost().then(() => {
                    setRefreshFlag(!refreshFlag);
                  });
                }}
              />
            </Card>
          }
        />
      )}
    />
  );
}
