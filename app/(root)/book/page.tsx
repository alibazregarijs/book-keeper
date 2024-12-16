import React from "react";
import { Navbar } from "@/components/navbar/Navbar";

import ListBook from "@/components/book/ListBook";

import { BookProps } from "@/components/book/types";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

const page = async () => {
  const session = await getSession();
  const userId = session?.user?.id;
  console.log(userId);
  const books = await prisma.book.findMany({
    include: {
      likes: {
        where: {
          userId: 1,
        },
      },
    },
  });

  return (
    <div className="">
      <Navbar />
      <ListBook books={books as any} />
    </div>
  );
};

export default page;
