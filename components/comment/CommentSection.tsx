"use client";
import { useState } from "react";
import Image from "next/image";
import { DirectRight } from "iconsax-react";
import FormReply from "./FormReply";
import { FormComment } from "./FormComment";
import { Session } from "next-auth";
import { generateRandomId } from "@/lib/utils";

interface Comment {
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
  session,
}: {
  bookId: string;
  userId: string;
  comments: Comment[];
  session: Session | null;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>("");
  const [newReply, setNewReply] = useState<string>("");
  const [replyState, setReplyState] = useState<{ [key: number]: boolean }>({});
  const [nestedReplyState, setNestedReplyState] = useState<{ [key: number]: boolean }>({});

  const handleReplyToggle = (commentId: number) => {
    setReplyState((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleNestedReplyToggle = (replyId: number) => {
    setNestedReplyState((prev) => ({ ...prev, [replyId]: !prev[replyId] }));
  };

  // Add a new comment to the top-level comments
  const addNewComment = (content: string) => {
    const newCommentObject: Comment = {
      id: Number(generateRandomId()),
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

  // Add a reply to a comment or nested reply to a reply
  const addReplyToComment = (
    parentCommentId: number,
    replyContent: string,
    isReply: boolean
  ) => {
    const newReply: Comment = {
      id: Number(generateRandomId()),
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
  };

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => (
      <div key={comment.id} className="border border-gray-200 p-4 space-y-5 rounded-md">
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
          <DirectRight
            onClick={() => {
              handleReplyToggle(comment.id);
            }}
            size="20"
            variant={replyState[comment.id] ? "Bold" : "Outline"}
            color="#000"
          />
        </div>
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
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-6 mt-4 space-y-4">{renderComments(comment.replies)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4 mb-8 border p-4 h-64 overflow-y-scroll">
        {renderComments(comments.filter((comment) => !comment.isReply))}
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
