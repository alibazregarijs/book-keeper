import { useState, useEffect } from "react";
import Image from "next/image";
import { DirectRight } from "iconsax-react";
import FormReply from "./FormReply";
import { FormComment } from "./FormComment";
import { Session } from "next-auth";
import { handleDelete, addNewComment, addReplyToComment } from "./utils";
import { getLastCommentId } from "../book/action";

export interface Comment {
  id: number;
  isReply: boolean;
  user: {
    name: string;
    avatar?: string;
    id: number;
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
  lengthOfComments: number;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>("");
  const [newReply, setNewReply] = useState<string>("");
  const [replyState, setReplyState] = useState<{ [key: number]: boolean }>({});
  const [lastCommentIdState, setLastCommentIdState] = useState<
    number | undefined
  >(0);

  const handleReplyToggle = (commentId: number) => {
    setReplyState({ [commentId]: !replyState[commentId] });
  };

  useEffect(() => {
    const fetchLastCommentId = async () => {
      const commentId = await getLastCommentId();
      setLastCommentIdState(commentId || 0);
    };
    fetchLastCommentId();
  }, [comments]);

  const handleDeleteComment = async (commentId: number) => {
    try {
      const updatedComments = handleDelete(commentId, comments);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error fetching last comment id:", error);
    }
  };

  const renderComments = (comments: Comment[]) => {
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
          {comment.user.id === Number(session?.user?.id) && (
            <p
              onClick={() => handleDeleteComment(comment.id)}
              className="text-sm text-red-500 cursor-pointer"
            >
              Delete
            </p>
          )}

          <DirectRight
            onClick={() => {
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
            id={lastCommentIdState!}
            setNewReply={setNewReply}
            newComment={newReply}
            parentCommentId={comment.id}
            userId={userId}
            bookId={bookId}
            onAddReply={() => {
              addReplyToComment(
                setComments,
                lastCommentIdState,
                session,
                comment.id,
                newReply,
                true
              );
            }}
          />
        )}

        {/* Render nested replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-6 mt-4 space-y-4">
            {renderComments(comment.replies)}
          </div>
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
        id={lastCommentIdState!}
        onAddComment={(content) => {
          addNewComment(content, setComments, lastCommentIdState, session);
        }}
      />
    </div>
  );
}
