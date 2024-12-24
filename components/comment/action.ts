"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(
  bookId: string | number,
  userId: string | number,
  content: string
) {
  const createdComment = await prisma.comment.create({
    data: {
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

    // Create the reply
    const createdReply = await prisma.comment.create({
      data: {
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
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}
