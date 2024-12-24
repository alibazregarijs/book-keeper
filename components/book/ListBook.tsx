"use client";
import React from "react";
import { BookProps } from "./types";
import Book from "./Book";
import Masonry from "react-masonry-css";
import { getLastCommentId } from "./action";
import { useState, useEffect } from "react";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 2,
  500: 1,
};

const ListBook = ({ books }: { books: BookProps[] }) => {
  const [lastCommentId, setLastCommentId] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchLastCommentId = async () => {
      const commentId = await getLastCommentId();
      setLastCommentId(commentId);
    };

    fetchLastCommentId();
  }, []);

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex animate-slide-fwd gap-10 relative mx-4"
    >
      {books?.map((book, index) => (
        <Book key={index} book={book} lengthOfComments={lastCommentId ?? 0} />
      ))}
    </Masonry>
  );
};

export default ListBook;
