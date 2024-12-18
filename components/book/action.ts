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

export async function IncreaseViews({
  bookId,
  userId,
}: {
  bookId: number;
  userId: number;
}) {
  try {
    // Check if the user has already viewed the book
    const existingView = await prisma.bookViews.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    // If no existing view, create a new record
    if (!existingView) {
      const newView = await prisma.bookViews.create({
        data: {
          userId,
          bookId,
          views: 1, // Initialize with 1 view
        },
      });
      return newView;
    }

    // If a view already exists, do nothing
    return existingView;
  } catch (error) {
    console.error("Error saving unique page view:", error);
    throw new Error("Failed to save unique page view");
  }

}


export async function getTotalViews(bookId: number): Promise<number> {
  try {
    const totalViews = await prisma.bookViews.aggregate({
      _sum: {
        views: true, // Specify the field to sum
      },
      where: {
        bookId, // Filter by the book ID
      },
    });

    return totalViews._sum.views || 0; // Return the total views, defaulting to 0 if null
  } catch (error) {
    console.error("Error fetching total views:", error);
    throw new Error("Failed to fetch total views");
  }
}