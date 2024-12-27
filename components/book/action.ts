"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
    console.log(userId,bookId,"in increase views");
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

export async function getLastCommentId() {
  try {
    const lastComment = await prisma.comment.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return lastComment?.id;
  } catch (error) {
    throw new Error("Failed to fetch last comment id");
  }
}

export async function getBookById({userId, bookId}:{userId:number,bookId:number}) {
  try {
    // Fetch the specific book by its ID with nested comments and replies
    const book = await prisma.book.findUnique({
      where: {
        id: bookId, // Use 'id' to filter the book
      },
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
              select: { name: true, avatar: true, id: true },
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
                  select: { name: true, avatar: true, id: true },
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
                      select: { name: true, avatar: true, id: true },
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
                          select: { name: true, avatar: true, id: true },
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

    if (!book) {
      throw new Error("Book not found");
    }

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

    // Map book with additional details
    const bookWithViewsAndSaveStatus = {
      ...book,
      totalViews: viewsMap[book.id] || 0,
      isSavedByUser:
        userId
          ? book.savedBy.some((item) => item.userId === userId && item.isSaved)
          : false,
      quantityOfLike: userId ? likesMap[book.id]?.[userId] || 0 : 0,
      likesCount: Object.keys(likesMap[book.id] || {}).length, // Count unique userId's for likes
      savedCount: book.savedBy.length,
    };

    return bookWithViewsAndSaveStatus; // Return the book with additional details
  } catch (error) {
    console.error("Error fetching book by id:", error);
    throw new Error("Failed to fetch book by id.");
  }
}
