import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment } from "./action";
import { getLastCommentId } from "../book/action";

export const FormComment = ({
  id,
  setNewComment,

  newComment,
  bookId,
  userId,
  onAddComment,
}: {
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  id: number;
  newComment: string;
  bookId: string;
  userId: string;
  onAddComment: (content: string) => void; // Function to handle adding a new comment
}) => {
  console.log(id, "iddd in for comment");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment); // Call the handler from props
      setNewComment(""); // Clear the input field
      createComment(id, bookId, userId, newComment);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Your reply"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border-gray-300"
      />
      <Button type="submit" className="bg-black text-white hover:bg-gray-800">
        Reply
      </Button>
    </form>
  );
};

export default FormComment;
