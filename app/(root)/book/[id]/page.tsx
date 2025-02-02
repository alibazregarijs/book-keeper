import React from "react";
import Book from "@/components/book/Book";
import { getBookById } from "@/components/book/action";
import ListBook from "@/components/book/ListBook";
import { getExploreBooks } from "@/lib/utils";
import { BookProps } from "@/components/book/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/lib/authOptions";
import { getAllBooks } from "@/components/book/action";
import { getbook } from "@/components/book/action";


export async function generateStaticParams() {
  const books = await getAllBooks();
 
  return books.map((book: any) => ({
    id: String(book.id),
  }))
}
 
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = await getbook(Number(id))
 
  return {
    title: book?.title,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId: number = Number(session?.user?.id);
  const bookId = parseInt(id);
  const books = await getBookById({bookId,userId});
  const book: BookProps[] = [books as any];

  return (
    <div>
      <ListBook oneBook={true} books={book} />
    </div>
  );
}
