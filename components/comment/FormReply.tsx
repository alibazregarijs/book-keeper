import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createReply } from "./action";
import { createNotification } from "./action";
import { useSeeCommentsDispatch } from "@/app/redux/store/hooks";
import {setSeeCommentsQuery} from "@/app/redux/store/SeeCommentsSlice";
import { useState } from "react";

export const FormReply = ({
  id, // is last id of comment
  setNewReply,
  newComment,
  parentCommentId,
  userId,
  bookId,
  onAddReply, // Callback to update parent state
  theUserAddBook
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
  theUserAddBook: number;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useSeeCommentsDispatch();
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddReply(parentCommentId, newComment.trim(), true); // Update the parent comment with the reply
      setNewReply(""); // Clear the reply input
      createReply(id, parentCommentId, newComment.trim(), userId, bookId, true);
      const notification = await createNotification(Number(userId), Number(theUserAddBook), Number(bookId), false, id);
      if (notification) {
        setIsSubmitting(false);
      }
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
        <Button  disabled={isSubmitting} onClick={()=>dispatch(setSeeCommentsQuery({showComments:true}))} type="submit" className="bg-black text-white hover:bg-gray-800">
          {isSubmitting ? "Submitting..." : "Reply"}
        </Button>
      </form>
    </div>
  );
};

export default FormReply;
