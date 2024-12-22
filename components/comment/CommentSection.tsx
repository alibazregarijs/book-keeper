'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  id: number
  author: string
  content: string
  date: string
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'John Doe', content: 'Great post!', date: '2023-06-15' },
    { id: 2, author: 'Jane Smith', content: 'I found this very helpful. Thanks for sharing!', date: '2023-06-16' },
  ])
  const [newComment, setNewComment] = useState({ author: '', content: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.author && newComment.content) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          ...newComment,
          date: new Date().toISOString().split('T')[0],
        },
      ])
      setNewComment({ author: '', content: '' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{comment.author}</h3>
              <span className="text-sm text-gray-500">{comment.date}</span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Your name"
          value={newComment.author}
          onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
          className="w-full border-gray-300"
        />
        <Textarea
          placeholder="Your comment"
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          className="w-full border-gray-300"
        />
        <Button type="submit" className="bg-black text-white hover:bg-gray-800">
          Add Comment
        </Button>
      </form>
    </div>
  )
}

