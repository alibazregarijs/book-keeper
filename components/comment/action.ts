"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment(
  id:number,
  bookId: string | number,
  userId: string | number,
  content: string
) {
  console.log(id,"id in action")
  const createdComment = await prisma.comment.create({
    data: {
      id:id+1,
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
  id:number,
  parentCommentId: number,
  content: string,
  userId: string | number,
  bookId: string | number,
  isReply: boolean
) {
  try {
    // Ensure parent comment exists
    console.log(id,"last id in action")
    console.log(parentCommentId,"parent in action")
    const parentComment = await prisma.comment.findUnique({
    
      where: { id: parentCommentId },
    });

    if (!parentComment) {
      console.log(parentCommentId,"parent comment id")
      throw new Error("Parent comment does not exist.");
    }

    // Create the reply
    const createdReply = await prisma.comment.create({
      data: {
        id:id+1,
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
  console.log(commentId, "comment id in delete");

  // Check if the comment exists
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    console.log(`Comment with ID ${commentId} does not exist.`);
    return { success: false, message: `Comment with ID ${commentId} does not exist.` };
  }

  // If the comment exists, delete it
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  console.log(`Comment with ID ${commentId} has been deleted.`);
  return { success: true, message: `Comment with ID ${commentId} has been deleted.` };
}

