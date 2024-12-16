"use server";
import { PrismaClient } from "@prisma/client";
// import { prisma } from '@/lib/prisma'; // Assuming your Prisma client instance is set up here
const prisma = new PrismaClient();
export async function likeAction({
  userId,
  bookId,
  countOfLike,
}: {
  userId: string;
  bookId: number;
  countOfLike: number;
}) {
  console.log(userId, bookId, countOfLike, "action server");

  // Upsert to either create or update the like record for the user and book
  const likeRecord = await prisma.bookLike.upsert({
    where: {
      userId_bookId: {
        userId: parseInt(userId), // Prisma expects Int for `userId`
        bookId: bookId,
      },
    },
    update: {
      countOfLike: countOfLike, // Update the count of likes for this user and book
      isLiked: countOfLike > 0, // Assuming isLiked is set based on countOfLike
    },
    create: {
      userId: parseInt(userId),
      bookId: bookId,
      countOfLike: countOfLike,
      isLiked: countOfLike > 0, // If countOfLike is greater than 0, mark as liked
    },
  });

  return likeRecord; // Optionally, return the updated or created like record
}


export async function saveBookAction({
  bookId,
  userId,
  isSaved,
}: {
  bookId: number;
  userId: number;
  isSaved: boolean;
}) {
  console.log(bookId, userId, isSaved);

  const saveBookRecord = await prisma.saveBook.upsert({
    where: {
      userId_bookId: {
        userId: userId,
        bookId: bookId,
      },
    },
    update: {
      isSaved: isSaved,
    },
    create: {
      userId: userId,
      bookId: bookId,
      isSaved: isSaved,
    },
  });

  return saveBookRecord;
}
