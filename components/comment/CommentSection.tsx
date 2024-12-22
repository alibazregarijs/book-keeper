"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "./action";
import Image from "next/image";

interface Comment {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
}

export default function CommentSection({
  bookId,
  userId,
  comments,
}: {
  bookId: string;
  userId: string;
  comments: Comment[];
}) {
  const [newComment, setNewComment] = useState<string>("");
  console.log(comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment) {
      createComment(bookId, userId, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4 mb-8 border p-4 h-64 overflow-y-scroll">
        {comments.map((comment, index) => (
          <div key={index} className="border border-gray-200 p-4 space-y-5 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1">
                <Image
                  src={comment?.user?.avatar!}
                  alt="User avatar"
                  width={30}
                  height={30}
                  className="rounded-full"
                />

                <h3 className="font-semibold">{comment?.user?.name}</h3>
              </div>

              <span className="text-sm text-gray-500">{comment.date}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border-gray-300"
        />
        <Button type="submit" className="bg-black text-white hover:bg-gray-800">
          Add Comment
        </Button>
      </form>
    </div>
  );
}
