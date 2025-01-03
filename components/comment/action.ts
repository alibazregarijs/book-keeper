"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export async function createComment(
  id: number,
  bookId: string | number,
  userId: string | number,
  content: string
) {
  
  console.log(id, "id in actionnnnnnnnnnnnn");
  const createdComment = await prisma.comment.create({
    data: {
      id: id + 1,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: typeof userId === "string" ? parseInt(userId) : userId,
      bookId: typeof bookId === "string" ? parseInt(bookId) : bookId,
    },
  });

  return createdComment;
}

export async function createReply(
  id: number,
  parentCommentId: number,
  content: string,
  userId: string | number,
  bookId: string | number,
  isReply: boolean
) {
  try {
    // Ensure parent comment exists
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentCommentId },
    });

    if (!parentComment) {
      throw new Error("Parent comment does not exist.");
    }

    console.log(id, "id in actionnnnnnnnnnnnn");
    // Create the reply
    const createdReply = await prisma.comment.create({
      data: {
        id: id + 1,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: typeof userId === "string" ? parseInt(userId, 10) : userId,
        bookId: typeof bookId === "string" ? parseInt(bookId, 10) : bookId,
        parentId: parentCommentId,
        isReply: isReply,
      },
    });

    return createdReply;
  } catch (error) {
    console.error("Error creating reply:");
    throw error; // Rethrow the error if needed for higher-level handling
  }
}
export async function deleteComment(commentId: number) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    console.log(`Comment with ID ${commentId} does not exist.`);
    return {
      success: false,
      message: `Comment with ID ${commentId} does not exist.`,
    };
  }

  // If the comment exists, delete it
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  console.log(`Comment with ID ${commentId} has been deleted.`);
  return {
    success: true,
    message: `Comment with ID ${commentId} has been deleted.`,
  };
}

export async function createNotification(
  userId: number,
  userGetReplyId: number,
  bookId: number,
  isRead: boolean,
  id: number
) {
  try {
    // Create the notification
    const createdNotification = await prisma.notification.create({
      data: {
        id: id + 1,
        userId: userId,
        userGetReplyId: userGetReplyId,
        bookId: bookId,
        isRead: isRead,
      },
    });
    revalidateTag("getUserNotifications");
    return createdNotification;
  } catch (error) {
    console.error("Error creating notification:");
    throw error; // Rethrow the error if needed for higher-level handling
  }
}

export const getUserNotifications = unstable_cache(
  async (userGetReplyId: number) => {
    console.log(
      `[getUserNotifications] Fetching notifications from DB for user ID: ${userGetReplyId}`
    );

    const notifications = await prisma.notification.findMany({
      where: {
        userGetReplyId: userGetReplyId,
        isRead: false,
      },
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        userGetReply: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return notifications;
  },
  ["getUserNotifications"], // Unique cache key for this function
  {
    tags: ["getUserNotifications"],
  }
);

export async function markNotificationAsRead(notificationId: number) {
  // Check if the notification exists
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) {
    console.log(`Notification with ID ${notificationId} does not exist.`);
    return {
      success: false,
      message: `Notification with ID ${notificationId} does not exist.`,
    };
  }

  // If the notification exists, mark it as read
  await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });

  console.log(
    `Notification with ID ${notificationId} has been marked as read.`
  );
  return {
    success: true,
    message: `Notification with ID ${notificationId} has been marked as read.`,
  };
}

export async function deleteNotifications(notificationIds: number[]) {
  console.log(notificationIds, "here serverrrrrrrrrrrr");
  try {
    // Delete the notifications
    await prisma.notification.deleteMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
    });

    console.log(`Notifications with IDs ${notificationIds} have been deleted.`);
    revalidateTag("getUserNotifications");
    return {
      success: true,
      message: `Notifications with IDs ${notificationIds} have been deleted.`,
    };
  } catch (error) {
    console.error("Error deleting notifications:");
    throw error; // Rethrow the error if needed for higher-level handling
  }
}
