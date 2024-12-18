"use client";
import React, { useMemo } from "react";
import ListBook from "./ListBook";
import { BookProps } from "./types";

const ClientBooks = ({ books }: { books: BookProps[] }) => {
  // Memoize the books data to avoid unnecessary re-computation
  const memoizedBooks = useMemo(() => books, [books]);

  return <ListBook books={memoizedBooks} />;
};

export default ClientBooks;
