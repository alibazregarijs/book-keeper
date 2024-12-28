import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createComment } from "./action";
import { createNotification } from "./action";
import { useSeeCommentsDispatch } from "@/app/redux/store/hooks";
import { setSeeCommentsQuery } from "@/app/redux/store/SeeCommentsSlice";

export const FormComment = ({
  id,
  setNewComment,
  newComment,
  bookId,
  userId,
  onAddComment,
  theUserAddBook,
}: {
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  id: number;
  newComment: string;
  bookId: string;
  userId: string;
  onAddComment: (content: string) => void; // Function to handle adding a new comment
  theUserAddBook: number;
}) => {
  const dispatch = useSeeCommentsDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment); // Call the handler from props
      setNewComment(""); // Clear the input field
      createComment(id, bookId, userId, newComment);
      createNotification(
        Number(userId),
        theUserAddBook,
        Number(bookId),
        false,
        id
      );
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
      <Button
        onClick={() => dispatch(setSeeCommentsQuery({ showComments: true }))}
        type="submit"
        className="bg-black text-white hover:bg-gray-800"
      >
        Reply
      </Button>
    </form>
  );
};

export default FormComment;
