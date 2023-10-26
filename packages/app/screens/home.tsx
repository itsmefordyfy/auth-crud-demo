import {
  ActivityIndicator,
  Button,
  FloatingView,
  H5,
  PromiseView,
  Row,
  TabScreen,
  Tabs,
  TabsProvider,
  Text,
  Card,
  QueryView,
  useFormState,
  FormTextInput,
  FormDatePicker,
  View
} from "app/components";

import { Modal, Portal, } from "react-native-paper";
import { User } from "@supabase/supabase-js";
import { getSession, loginUser, logoutUser } from "app/models/auth";
import { useClient } from "app/provider";
import { useRouter } from "solito/router";
import { ClientType } from "app/provider/supabase-provider";
import { getGenres, useBookQuery, deleteBooks, addBook, updateBook } from "app/models";
import { FlatList } from "react-native";
import { useSelectedItemsStore } from "app/store";
import { useState } from "react";
import { getBookInfo, BookInfo } from "app/models";

export function HomeScreen() {
  const client = useClient();

  return (
    <PromiseView
      promise={getSession(client)}
      loadingView={<ActivityIndicator />}
      loadedView={(session) => (session ?
        <ContentView user={session.user} /> : <RedirectView />)
      }
    />
  );
}

function RedirectView() {
  const { replace } = useRouter();
  return <FloatingView>
    <H5>You are not login yet</H5>
    <Button onPress={() => replace("/login")}>Go to login</Button>
  </FloatingView>;
}

interface ContentProps {
  user: User
}

function ContentView({ user }: ContentProps) {
  const client = useClient();

  return <PromiseView
    promise={getGenres(client)}
    loadingView={<ActivityIndicator />}
    loadedView={(genres) => {
      if (genres === null) return <H5>Nothing to show</H5>;
      return <TabsProvider defaultIndex={0}>
        <Tabs uppercase showTextLabel mode="scrollable" className="mx-2 mt-8">
          {genres.map((genre) => <TabScreen key={genre} label={genre}>
            <BookList client={client} genre={genre} />
          </TabScreen>
          )}
        </Tabs>
      </TabsProvider>
    }} />;
}

interface BookListProps {
  client: ClientType,
  genre: string,
}

function BookList({ client, genre }: BookListProps) {
  const { addItem,
    removeItem,
    isSelected,
    count,
    clear,
    getItems
  } = useSelectedItemsStore();
  const [onDelete, setOnDelete] = useState(false);
  const bookQuery = useBookQuery(client, genre);
  const [visible, setVisible] = useState(false);
  const { replace } = useRouter();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleLogout = () => {
    logoutUser(client).then(() => {
      replace("/login");
    });
  };

  return <QueryView
    query={bookQuery}
    loadingView={<ActivityIndicator />}
    loadedView={(books, refetch) => {
      if (books === null) return <H5>Nothing to show</H5>;
      const selectedCount = count();
      const itemSizeDisplay = selectedCount == 1 ? "1 item" : `${selectedCount} items`;

      const handleRemove = () => {
        setOnDelete(true);
        deleteBooks(client, getItems()).then(() => {
          clear();
          setOnDelete(false);
          refetch();
        })
          .catch(() => { });
      };

      return <>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal}>
            <AddItemModal client={client}
              id={selectedCount === 1 ? getItems()[0] : undefined}
              cancel={hideModal}
              onFinish={() => {
                refetch();
                hideModal();
                if (selectedCount === 1) clear();
              }} />
          </Modal>
        </Portal>
        <FlatList data={books}
          ListFooterComponent={onDelete ? <ActivityIndicator /> :
            <Row className="max-w-sm self-center">{
              (selectedCount > 0) && <Button className="m-2" onPress={handleRemove}>
                <Text>{`Remove ${itemSizeDisplay}`}</Text>
              </Button>}
              <Button mode="outlined" className="m-2" onPress={showModal}>
                <Text>{`${selectedCount === 1 ? "Update" : "Add"}`}</Text>
              </Button>
              <Button mode="outlined" className="m-2" onPress={handleLogout}>Logout</Button>
            </Row>}
          renderItem={({ item: book }) => {
            const selected = isSelected(book.id);
            const handleSelect = () => {
              if (selected) {
                removeItem(book.id);
              } else {
                addItem(book.id);
              }
            };

            const textStyle = {
              color: selected ? "white" : undefined,
            };

            return <Card key={book.id} className="cursor-pointer p-4 m-4" style={{
              backgroundColor: selected ? "tomato" : undefined,
            }} onPress={handleSelect}>
              <Row>
                <Text className="font-semibold" style={textStyle}>{book.title}</Text>
                <Text style={textStyle}>{` by ${book.author}`}</Text>
              </Row>
              <Text className="m-2" style={textStyle}>{`Published on: ${formatDate(book.published_date)}`}</Text>
            </Card>;
          }} /></>;
    }}
  />;
}

function formatDate(date: Date) {
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
}

interface AddItemProps {
  id?: string,
  client: ClientType,
  onFinish: () => void;
  cancel: () => void;
}

function AddItemModal({ id, client, onFinish, cancel }: AddItemProps) {
  const getInfo = async () => {
    return id ? await getBookInfo(client, id) : undefined;
  };

  return <PromiseView promise={getInfo()} loadedView={(data) => (
    <AddItemForm data={data === null ? undefined : data}
      client={client}
      id={id}
      onFinish={onFinish}
      cancel={cancel}
    />)
  } />;
}

interface AddItemFormProps {
  data: BookInfo | undefined,
  client: ClientType,
  id: string | undefined,
  onFinish: () => void;
  cancel: () => void;
}

function AddItemForm({ data, client, id, onFinish, cancel }: AddItemFormProps) {
  const formState = useFormState({
    title: data ? data.title : "",
    author: data ? data.author : "",
    genre: data ? data.genre : "",
    published_date: data ? data.published_date.toJSON() : "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const requestData = {
      title: formState.state.title,
      author: formState.state.author,
      genre: formState.state.genre,
      published_date: new Date(formState.state.published_date)
    };

    (id === undefined ? addBook(client, requestData) : updateBook(client, id, requestData))
      .then(() => {
        setLoading(false);
        onFinish();
      });
  };

  return <FloatingView>
    <FormTextInput label={"Book Title"} formState={formState} fieldName={"title"} />
    <FormTextInput label={"Book Author"} formState={formState} fieldName={"author"} />
    <FormTextInput label={"Genre"} formState={formState} fieldName={"genre"} />
    <FormDatePicker label="Publish Date" formState={formState} fieldName={"published_date"} />
    {loading ?
      <ActivityIndicator className="m-6" /> : <Row className="self-center">
        <Button className="mx-2 my-6" onPress={handleSubmit}>Done</Button>
        <Button mode="outlined" className="mx-2 my-6" onPress={cancel}>Cancel</Button>
      </Row>}

  </FloatingView>;
}
