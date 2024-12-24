import { useState, useEffect } from "react";
import Image from "next/image";
import { DirectRight } from "iconsax-react";
import FormReply from "./FormReply";
import { FormComment } from "./FormComment";
import { Session } from "next-auth";
import { generateRandomId } from "@/lib/utils";
import { deleteComment } from "./action";
import { getLastCommentId } from "../book/action";

export interface Comment {
  id: number;
  isReply: boolean;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  replies?: Comment[];
}

export default function CommentSection({
  bookId,
  userId,
  comments: initialComments,
  lengthOfComments,
  session,
}: {
  bookId: string;
  userId: string;
  comments: Comment[];
  session: Session | null;
  lengthOfComments: number;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>("");
  const [newReply, setNewReply] = useState<string>("");
  const [lastId, setLastId] = useState(null);
  const [replyState, setReplyState] = useState<{ [key: number]: boolean }>({});
  const [nestedReplyState, setNestedReplyState] = useState<{
    [key: number]: boolean;
  }>({});

  const handleReplyToggle = (commentId: number) => {
    setReplyState({ [commentId]: !replyState[commentId] });
  };

  const handleNestedReplyToggle = (replyId: number) => {
    setNestedReplyState((prev) => ({ ...prev, [replyId]: !prev[replyId] }));
  };

  const handleDelete = (commentId: number, comments = initialComments) => {
    const updatedComments = comments
      .map((comment) => {
        if (comment.id === commentId) {
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

  const handleDeleteComment = (commentId: number) => {
    const updatedComments = handleDelete(commentId, comments);
    setComments(updatedComments);
  };

  const addNewComment = (content: string) => {
    const lastComment = comments[0];
    const lastCommentId = lastComment?.id;
    console.log(comments, "comments");
    console.log(lastCommentId, "last comment id");

    const newCommentObject: Comment = {
      id:
        lastCommentId > lengthOfComments
          ? lastCommentId + 1
          : lengthOfComments + 1,
      isReply: false,
      user: {
        name: session?.user?.name || "Current User",
        avatar: session?.user?.image || "/default-avatar.png",
      },
      content,
      date: new Date().toLocaleDateString(),
      replies: [],
    };

    setComments((prev) => [newCommentObject, ...prev]);
  };

  const addReplyToComment = async (
    parentCommentId: number,
    replyContent: string,
    isReply: boolean
  ) => {
    try {
      const lastCommentId = (await getLastCommentId()) ?? 0; // Use 0 if lastCommentId is undefined

      const newReply: Comment = {
        id: lastCommentId + 1, // Increment the ID
        isReply,
        user: {
          name: session?.user?.name || "Current User",
          avatar: session?.user?.image || "/default-avatar.png",
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

  const renderComments = (comments: Comment[], lastCommentId: number) => {
    comments.map((comment) => {
      console.log(comment, "comment id in looop");
    });
    return comments.map((comment, index) => (
      <div
        key={index}
        className="border border-gray-200 p-4 space-y-5 rounded-md"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-1">
            <Image
              src={comment.user.avatar || "/default-avatar.png"}
              alt="User avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
            <h3 className="font-semibold">{comment.user.name}</h3>
          </div>
          <span className="text-sm text-gray-500">{comment.date}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">{comment.content}</p>
          <p
            onClick={() => handleDeleteComment(comment.id)}
            className="text-sm text-red-500 cursor-pointer"
          >
            Delete
          </p>
          <DirectRight
            onClick={() => {
              console.log(comment.id, "parentIddddddddddd");
              handleReplyToggle(comment.id);
            }}
            size="20"
            variant={replyState[comment.id] ? "Bold" : "Outline"}
            color="#000"
          />
        </div>

        {/* Show reply form only for the current comment */}
        {replyState[comment.id] && (
          <FormReply
            setNewReply={setNewReply}
            newComment={newReply}
            parentCommentId={comment.id}
            parentCommentAuthor={comment.user.name}
            userId={userId}
            bookId={bookId}
            onAddReply={addReplyToComment}
          />
        )}

        {/* Render nested replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-6 mt-4 space-y-4">
            {renderComments(comment.replies, lastCommentId)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4 mb-8 border p-4 h-64 overflow-y-scroll">
        {renderComments(
          comments.filter((comment) => !comment.isReply),
          lengthOfComments
        )}
      </div>
      <FormComment
        setNewComment={setNewComment}
        newComment={newComment}
        bookId={bookId}
        userId={userId}
        onAddComment={addNewComment}
      />
    </div>
  );
}
