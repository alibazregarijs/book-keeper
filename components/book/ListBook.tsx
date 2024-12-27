"use client";
import React from "react";
import { BookProps } from "./types";
import Book from "./Book";
import Masonry from "react-masonry-css";
import { getLastCommentId } from "./action";
import { useState, useEffect } from "react";

// const breakpointColumnsObj = {
//   default: 3,
//   1100: 2,
//   700: 2,
//   500: 1,
// };

const breakpointColumnsObj = {
  default: 3,
  1300: 2,
  1000: 1,
  700: 1,
  500: 1,
};

const ListBook = ({ books , oneBook }: { books: BookProps[] , oneBook:boolean }) => {

  const dynamicBreakpointColumnsObj = oneBook
  ? { default: 3 }
  : breakpointColumnsObj;

  const masonryClass = oneBook ? "flex justify-center animate-slide-fwd gap-10 relative mx-4" :"flex animate-slide-fwd gap-10 relative mx-4"

  return (
    <Masonry
      breakpointCols={dynamicBreakpointColumnsObj}
      className={masonryClass}
    >
      {books?.map((book, index) => (
        <Book key={index} book={book} oneBook={oneBook} />
      ))}
    </Masonry>
  );
};

export default ListBook;
