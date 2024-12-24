import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  likeAction,
  IncreaseViews,
  saveBookAction,
} from "@/components/book/action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setRate = async ({
  liked,
  index,
  boldStars,
  bookId,
  userId,
  setBoldStars,
}: {
  liked: boolean;
  index: number;
  boldStars: boolean[];
  bookId: number;
  userId: string;
  setBoldStars: React.Dispatch<React.SetStateAction<boolean[]>>;
}) => {
  // Update the stars state
  const newBoldStars = [...boldStars];
  if (!liked) {
    newBoldStars.fill(true, 0, index + 1);
  } else {
    newBoldStars.fill(false, index, 5);
  }

  setBoldStars(newBoldStars);
  const likedCount = newBoldStars.filter((value) => value === true).length;
  // Call the server action

  await likeAction({
    userId: userId as string,
    bookId: bookId,
    countOfLike: likedCount,
  });
};

export const setViewsFunc = async ({
  bookId,
  userId,
}: {
  bookId: number;
  userId: string;
}) => {
  await IncreaseViews({ bookId: bookId, userId: Number(userId) });
};

export const savedBook = async ({
  bookId,
  isSaved,
  userId,
}: {
  bookId: number;
  isSaved: boolean;
  userId: string;
}) => {
  await saveBookAction({
    userId: Number(userId),
    bookId: bookId,
    isSaved: isSaved,
  });
};

export const getExploreBooks = async ({ userId }: { userId?: number }) => {
  try {
    // Fetch books with nested comments and replies
    const books = await prisma.book.findMany({
      include: {
        savedBy: {
          select: { userId: true, isSaved: true },
        },
        comments: {
          select: {
            id: true,
            isReply: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            user: {
              select: { name: true, avatar: true }, // Include user details
            },
            replies: {
              select: {
                id: true,
                isReply: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                user: {
                  select: { name: true, avatar: true },
                },
                replies: {
                  select: {
                    id: true,
                    isReply: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    userId: true,
                    user: {
                      select: { name: true, avatar: true },
                    },
                    replies: {
                      // Continue nesting for deeper replies if necessary
                      select: {
                        id: true,
                        isReply: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                        userId: true,
                        user: {
                          select: { name: true, avatar: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Fetch views data grouped by bookId
    const views = await prisma.bookViews.groupBy({
      by: ["bookId"],
      _sum: {
        views: true,
      },
    });

    // Fetch like counts grouped by bookId and userId
    const likes = await prisma.bookLike.groupBy({
      by: ["bookId", "userId"],
      _sum: {
        countOfLike: true,
      },
    });

    // Create lookup maps for views and likes
    const viewsMap = views.reduce((acc, view) => {
      acc[view.bookId] = view._sum.views || 0;
      return acc;
    }, {} as Record<number, number>);

    const likesMap = likes.reduce((acc, like) => {
      if (!acc[like.bookId]) acc[like.bookId] = {};
      acc[like.bookId][like.userId] = like._sum.countOfLike || 0;
      return acc;
    }, {} as Record<number, Record<number, number>>);

    // Map books with additional details
    const booksWithViewsAndSaveStatus = books.map((book) => {
      const totalViews = viewsMap[book.id] || 0;

      // Check if the user saved this book
      const isSavedByUser = userId
        ? book.savedBy.some((item) => item.userId === userId && item.isSaved)
        : false;

      // Get the like count for the userId, if available
      const quantityOfLike = userId ? likesMap[book.id]?.[userId] || 0 : 0;

      return {
        ...book,
        totalViews,
        isSavedByUser,
        quantityOfLike,
        likesCount: Object.keys(likesMap[book.id] || {}).length, // Count unique userId's for likes
        savedCount: book.savedBy.length,
      };
    });

    // Sort books by priority: likes, views, and saves
    const sortedBooks = booksWithViewsAndSaveStatus.sort((a, b) => {
      if (b.likesCount !== a.likesCount) return b.likesCount - a.likesCount;
      if (b.totalViews !== a.totalViews) return b.totalViews - a.totalViews;
      return b.savedCount - a.savedCount;
    });

    return sortedBooks; // Return sorted books
  } catch (error) {
    console.error("Error fetching explore books:", error);
    throw new Error("Failed to fetch explore books.");
  }
};
export const generateRandomId = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};
