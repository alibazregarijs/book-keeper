import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createReply } from "./action";

export const FormReply = ({
  id, // is last id of comment
  setNewReply,
  newComment,
  parentCommentId,
  userId,
  bookId,
  onAddReply, // Callback to update parent state
}: {
  id: number;
  setNewReply: React.Dispatch<React.SetStateAction<string>>;
  newComment: string;
  parentCommentId: number;
  userId: string;
  bookId: string;

  onAddReply: (
    parentCommentId: number,
    replyContent: string,
    isReply: boolean
  ) => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddReply(parentCommentId, newComment.trim(), true); // Update the parent comment with the reply
      setNewReply(""); // Clear the reply input
      createReply(id, parentCommentId, newComment.trim(), userId, bookId, true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Your reply"
          value={newComment}
          onChange={(e) => setNewReply(e.target.value)}
          className="w-full border-gray-300"
        />
        <Button type="submit" className="bg-black text-white hover:bg-gray-800">
          Reply
        </Button>
      </form>
    </div>
  );
};

export default FormReply;
