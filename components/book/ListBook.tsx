import React from 'react'
import { BookProps } from './types'
import Book from './Book'

const ListBook = ({books}:{books:BookProps[]}) => {
  return (
    <div>
        {books.map((book,index)=>{
            return <Book key={index} book={book} />
        })}
    </div>
  )
}

export default ListBook