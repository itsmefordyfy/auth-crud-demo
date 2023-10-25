import { ClientType } from "app/provider/supabase-provider";
import { useQuery } from "react-query";

interface Book {
  id: string,
  title: string,
  author: string,
  genre: string,
  published_date: Date,
  created_at: Date,
  updated_at: Date,
}

type BookPartial = Pick<Book,
  "id" |
  "title" |
  "author" |
  "genre" |
  "published_date"
>;

export type BookInfo = Pick<Book,
  "title" |
  "author" |
  "genre" |
  "published_date"
>;

export async function getGenres(client: ClientType) {
  const { data } = await client
  .from("Books")
  .select("genre");

  if (data === null) return null;

  return [...new Set(data
    .map(item => item.genre as string))];
}

export async function getBooks(client: ClientType, genre: string) {
  const { data } = await client
  .from("Books")
  .select("id, title, author, genre, published_date")
  .eq("genre", genre);

  return data?.map((item) => ({
      id: item.id as string,
      title: item.title as string,
      author: item.author as string,
      genre: item.genre as string,
      published_date: new Date(item.published_date),
    } as BookPartial)
  );
}

export async function deleteBooks(client: ClientType, bookIds: string[]) {
  await client
  .from("Books")
  .delete()
  .in("id", bookIds);
}

export async function addBook(client: ClientType, book: BookInfo) {
  await client
  .from("Books")
  .insert(book);
}

export async function updateBook(client: ClientType, id: string, book: BookInfo) {
  await client
  .from("Books")
  .update(book)
  .eq("id", id);
}

export async function getBookInfo(client: ClientType, id: string ) {
  const { data } = await client
  .from("Books")
  .select("title, author, genre, published_date")
  .eq("id", id)
  .single();

  if (data === null) return undefined;

  return {
    title: data.title as string,
    author: data.author as string,
    genre: data.genre as string,
    published_date: new Date(data.published_date),
  } as BookInfo;
}

export function useBookQuery(client: ClientType, genre: string) {
  return useQuery("books_data", async () => await getBooks(client, genre));
}
