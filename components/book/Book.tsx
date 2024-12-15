import React from 'react'
import { BookProps } from './types'

const Book = ({book}:{book:BookProps}) => {
  return (
    <div>
        {book.title}
        {book.genre}
        {book.pageCount}
        {book.userId}
        {book.imageUrl}
    </div>
  )
}

export default Book