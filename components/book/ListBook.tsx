"use client";
import React from "react";
import { BookProps } from "./types";
import Book from "./Book";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 2,
  500: 1,
};

const ListBook = ({ books }: { books: BookProps[] }) => {
    return (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex animate-slide-fwd gap-10 relative mx-4"
        >
          {books?.map((book) => <Book key={book.id} book={book} />)}
        </Masonry>
      );
};

export default ListBook;
