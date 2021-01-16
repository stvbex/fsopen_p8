import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import { ALL_BOOKS_W_GENRE } from '../queries'

const Recommendations = ({ show, currentUser }) => {
  const [getBooks, { loading: booksLoading, data: booksData }] = useLazyQuery(ALL_BOOKS_W_GENRE)

  const [books, setBooks] = useState([])

  useEffect(() => {
    if (currentUser) {
      getBooks({ variables: { genre: currentUser.favoriteGenre } })
    }
  }, [currentUser, getBooks])

  useEffect(() => {
    if (!booksLoading && booksData) {
      setBooks(booksData.allBooks)
    }
  }, [booksLoading, booksData])

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <b>{currentUser && currentUser.favoriteGenre}</b>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b, i) =>
            <tr key={i}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Recommendations