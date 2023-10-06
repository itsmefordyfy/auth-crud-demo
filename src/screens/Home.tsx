import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
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
        if (user === null) return <ActivityIndicator style={{ margin: 32 }} />;

        return <Content user={user} />;
      }}
    />
  );
}

interface ContentProps {
  user: User;
}

function Content({ user }: ContentProps) {
  const metadata = user.user_metadata as DisplayUser;
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View
      style={{
        justifyContent: "flex-start",
        alignContent: "center",
        flex: 1,
      }}
    >
      <Appbar
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          zIndex: 2,
          justifyContent: "flex-end",
        }}
      >
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

        <IconButton
          icon="account"
          mode="contained"
          style={{
            marginHorizontal: 12,
            marginVertical: 8,
          }}
          onPress={showModal}
        />
      </Appbar>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <Card
            mode="elevated"
            style={{
              alignSelf: "center",
              padding: 12,
              flex: 1,
              maxWidth: 340,
              minHeight: 300,
            }}
          >
            <IconButton
              icon="close"
              mode="contained"
              size={18}
              onPress={hideModal}
            />
            <Text
              style={{
                margin: 8,
              }}
            >{`Email: ${user.email}`}</Text>
            <Text
              style={{
                margin: 8,
              }}
            >{`First Name: ${metadata.firstName}`}</Text>
            <Text
              style={{
                margin: 8,
              }}
            >{`Last Name: ${metadata.lastName}`}</Text>
            <Text
              style={{
                margin: 8,
              }}
            >{`Phone: ${metadata.phoneNumber}`}</Text>
          </Card>
        </Modal>
      </Portal>
      <View
        style={{
          left: 0,
          right: 0,
          top: 0,
          zIndex: -1,
          height: 44,
        }}
      />
      <PostViewer user={user} />
    </View>
  );
}

function PostViewer({ user }: ContentProps) {
  const getPosts = async () => {
    return (
      (await supabaseClient.from("Post").select()).data as {
        id: string;
        text: string;
        created_at: string;
      }[]
    ).sort((a, b) => a.created_at.localeCompare(b.created_at));
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

  return (
    <PromiseView
      promise={getPosts()}
      refreshFlag={refreshFlag}
      loadingView={<ActivityIndicator style={{ margin: 48 }} />}
      loadedView={(data) => (
        <FlatList
          style={{
            margin: 8,

            flex: 1,
            padding: 8,
          }}
          data={data}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              refreshFlag={refreshFlag}
              setRefreshFlag={setRefreshFlag}
            />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          ListFooterComponentStyle={{ flex: 1, justifyContent: "flex-end" }}
          ListFooterComponent={
            <Card
              style={{
                alignSelf: "center",
                minWidth: 360,
                padding: 12,
                margin: 12,
                flex: 1,
              }}
            >
              <TextInput
                ref={textRef}
                mode="outlined"
                multiline
                style={{
                  flex: 1,
                  minHeight: 86,
                  maxHeight: 96,
                  margin: 8,
                  padding: 8,
                }}
                onChangeText={(inputText) => setText(inputText)}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
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
              </View>
            </Card>
          }
        />
      )}
    />
  );
}

interface ItemData {
  id: string;
  text: string;
}

interface ItemCardProps {
  item: ItemData;
  refreshFlag: boolean;
  setRefreshFlag: (value: boolean) => void;
}

function ItemCard({ item, refreshFlag, setRefreshFlag }: ItemCardProps) {
  const [onEdit, setOnEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(item.text);

  const removePost = async (id: string) => {
    await supabaseClient.from("Post").delete().eq("id", id);
  };

  const updatePost = async (id: string) => {
    await supabaseClient
      .from("Post")
      .update({
        text: text,
      })
      .eq("id", id);
  };

  return (
    <Card
      key={item.id}
      style={{
        alignSelf: "center",
        minWidth: 360,
        padding: 12,
        margin: 12,
        flex: 1,
      }}
    >
      {onEdit ? (
        <TextInput
          mode="outlined"
          multiline
          value={text}
          style={{
            flex: 1,
            minHeight: 86,
            maxHeight: 96,
            margin: 8,
            padding: 8,
          }}
          onChangeText={(inputText) => setText(inputText)}
        />
      ) : (
        <Text
          style={{
            margin: 12,
          }}
        >
          {item.text}
        </Text>
      )}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
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
        {!onEdit && (
          <IconButton
            icon="comment-edit-outline"
            mode="contained"
            size={20}
            onPress={() => {
              setOnEdit(true);
            }}
          />
        )}
        {loading && <ActivityIndicator style={{ margin: 8 }} />}
        {onEdit && !loading && (
          <>
            <IconButton
              icon="comment-check-outline"
              mode="contained"
              disabled={text === item.text}
              size={20}
              onPress={() => {
                setLoading(true);
                updatePost(item.id).then(() => {
                  setOnEdit(false);
                  setRefreshFlag(!refreshFlag);
                  setLoading(false);
                });
              }}
            />
            <IconButton
              icon="cancel"
              mode="contained"
              size={20}
              onPress={() => {
                setOnEdit(false);
                setText(item.text);
              }}
            />
          </>
        )}
      </View>
    </Card>
  );
}
