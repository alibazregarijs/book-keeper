import React from "react";
import { Navbar } from "@/components/navbar/Navbar";

import ListBook from "@/components/book/ListBook";

import { BookProps } from "@/components/book/types";
import { prisma } from "@/lib/prisma";

const page = async () => {
  const books = await prisma.book.findMany();
  return (
    <div className="">
      <Navbar />
      <ListBook books={books as BookProps[]} />
    </div>
  );
};

export default page;
