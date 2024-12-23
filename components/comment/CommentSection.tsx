"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createComment, createReply } from "./action"; // Add `createReply` import
import Image from "next/image";
import { DirectRight } from "iconsax-react";
import FormReply from "./FormReply"; // Form for creating replies
import { FormComment } from "./FormComment"; // Form for creating new comments
import { Session } from "next-auth";

interface Comment {
  id: number;
  isReply: boolean;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  replies?: Comment[]; // Added replies for each comment
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
  const [comments, setComments] = useState<Comment[]>(initialComments); // State for comments
  const [newComment, setNewComment] = useState<string>("");

  const [replyState, setReplyState] = useState<{ [key: number]: boolean }>({});
  const [nestedReplyState, setNestedReplyState] = useState<{
    [key: number]: boolean;
  }>({});

  const handleReplyToggle = (commentId: number) => {
    setReplyState((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle reply form visibility
    }));
  };

  const handleNestedReplyToggle = (replyId: number) => {
    setNestedReplyState((prev) => ({
      ...prev,
      [replyId]: !prev[replyId], // Toggle nested reply form visibility
    }));
  };

  // Add a new comment to the comments state
  const addNewComment = (content: string) => {
    const newCommentObject: Comment = {
      id: comments.length + 1, // Generate a new ID
      isReply: false,
      user: {
        name: session?.user?.name || "Current User", // Replace with actual user name
        avatar: session?.user?.image || "/default-avatar.png", // Replace with actual user avatar if available
      },
      content,
      date: new Date().toLocaleDateString(),
      replies: [],
    };

    setComments((prev) => [newCommentObject, ...prev]); // Add the new comment to the state
  };

  // Add a reply to a parent comment
  const addReplyToComment = (
    parentCommentId: number,
    replyContent: string,
    isReply: boolean
  ) => {
    const newReply: Comment = {
      id: comments.length + 1, // Generate a new ID
      isReply,
      user: {
        name: session?.user?.name || "Current User", // Replace with actual user name
        avatar: session?.user?.image || "/default-avatar.png", // Replace with actual user avatar if available
      },
      content: replyContent,
      date: new Date().toLocaleDateString(),
    };

    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: comment.replies
              ? [newReply, ...comment.replies]
              : [newReply],
          };
        }
        return comment;
      })
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.length > 0 && (
        <div className="space-y-4 mb-8 border p-4 h-64 overflow-y-scroll">
          {comments
            .filter((comment) => !comment.isReply)
            .map((comment) => (
              <div
                key={comment.id}
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

                  {/* Toggle reply button */}
                  <DirectRight
                    onClick={() => handleReplyToggle(comment.id)}
                    size="20"
                    variant={replyState[comment.id] ? "Bold" : "Outline"}
                    color="#000"
                  />
                </div>

                {/* Render reply form if toggled */}
                {replyState[comment.id] && (
                  <FormReply
                    setNewReply={setNewComment}
                    newComment={newComment}
                    parentCommentId={comment.id}
                    userId={userId}
                    bookId={bookId}
                    onAddReply={addReplyToComment} // Pass the function to add replies
                  />
                )}

                {/* Render replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="border border-gray-200 p-4 space-y-5 rounded-md"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-1">
                            <Image
                              src={reply.user.avatar || "/default-avatar.png"}
                              alt="User avatar"
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <h3 className="font-semibold">{reply.user.name}</h3>
                          </div>
                          <span className="text-sm text-gray-500">
                            {reply.date}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">{reply.content}</p>
                          <DirectRight
                            onClick={() => handleNestedReplyToggle(reply.id)}
                            size="20"
                            variant={
                              nestedReplyState[reply.id] ? "Bold" : "Outline"
                            }
                            color="#000"
                          />
                        </div>
                        {/* Render reply form if toggled */}
                        {nestedReplyState[reply.id] && (
                          <FormReply
                            setNewReply={setNewComment}
                            newComment={newComment}
                            parentCommentId={comment.id}
                            userId={userId}
                            bookId={bookId}
                            onAddReply={addReplyToComment} // Pass the function to add replies
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Form to add a new comment */}
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
