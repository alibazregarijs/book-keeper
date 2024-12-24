import { type Comment } from "./CommentSection";
import { type Session } from "next-auth";
import { generateRandomId } from "@/lib/utils";

export const handleDelete = ({
  commentId,
  comments,
}: {
  commentId: number;
  comments: Comment[];
}) => {
  const updatedComments = comments
    .map((comment) => {
      if (comment.id === commentId) {
        return null;
      }

      if (comment.replies) {
        comment.replies = handleDelete({
          commentId,
          comments: comment.replies,
        });
      }

      return comment;
    })

    .filter((comment) => comment !== null);

  return updatedComments;
};

export const addNewComment = ({
  content,
  username,
  userImage,
  setComments,
}: {
  content: string;
  username?: string;
  userImage?: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) => {
  const newCommentObject: Comment = {
    id: Number(generateRandomId()),
    isReply: false,
    user: {
      name: username || "Current User",
      avatar: userImage || "/default-avatar.png",
    },
    content,
    date: new Date().toLocaleDateString(),
    replies: [],
  };

  setComments((prev) => [newCommentObject, ...prev]);
};

export const addReplyToComment = ({
  parentCommentId,
  replyContent,
  isReply,
  setComments,
  username,
  userImage,
}: {
  parentCommentId: number;
  replyContent: string;
  isReply: boolean;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  username?: string;
  userImage?: string;
}) => {
  const newReply: Comment = {
    id: Number(generateRandomId()),
    isReply,
    user: {
      name: username || "Current User",
      avatar: userImage || "/default-avatar.png",
    },
    content: replyContent,
    date: new Date().toLocaleDateString(),
    replies: [],
  };

  setComments((prevComments:Comment[]) =>
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
          replies: comment.replies.map((reply:Comment) =>
            reply.id === parentCommentId
              ? { ...reply, replies: [newReply, ...(reply.replies || [])] }
              : reply
          ),
        };
      }
      return comment;
    })
  );
};
