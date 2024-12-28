import { type Comment } from "./CommentSection";
import { type Session } from "next-auth";

import { deleteComment } from "./action";
import { useCallback } from "react";

export const handleDelete = (commentId: number, comments: Comment[]) => {
  const updatedComments = comments
    .map((comment) => {
      if (comment.id === commentId) {
        deleteComment(commentId);
        
        return null;
      }

      if (comment.replies) {
        comment.replies = handleDelete(commentId, comment.replies);
      }

      return comment;
    })
    .filter((comment) => comment !== null);

  return updatedComments;
};

export const addNewComment = async (
  content: string,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  lastCommentIdState: number | undefined,
  session: Session | null
) => {
  try {
    const newCommentObject: Comment = {
      id: lastCommentIdState! + 1,
      isReply: false,
      user: {
        name: session?.user?.name || "Current User",
        avatar: session?.user?.image || "/default-avatar.png",
        id: Number(session?.user?.id),
      },
      content,
      date: new Date().toLocaleDateString(),
      replies: [],
    };
    setComments((prev) => [newCommentObject, ...prev]);
  } catch (error) {}
};

export const addReplyToComment = async (
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  lastCommentIdState: number | undefined,
  session: Session | null,
  parentCommentId: number,
  replyContent: string,
  isReply: boolean
) => {
  try {
    const newReply: Comment = {
      id: lastCommentIdState! + 1, // Increment the ID
      isReply,
      user: {
        name: session?.user?.name || "Current User",
        avatar: session?.user?.image || "/default-avatar.png",
        id: Number(session?.user?.id),
      },
      content: replyContent,
      date: new Date().toLocaleDateString(),
      replies: [],
    };

    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [newReply, ...(comment.replies || [])],
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === parentCommentId
                ? { ...reply, replies: [newReply, ...(reply.replies || [])] }
                : reply
            ),
          };
        }
        return comment;
      })
    );
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};
