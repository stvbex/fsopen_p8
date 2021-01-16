import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
  const booksQuery = useQuery(ALL_BOOKS)
  const meQuery = useQuery(ME)

  const [currentUser, setCurrentUser] = useState(null)
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (!meQuery.loading && meQuery.data.me) {
      setCurrentUser(meQuery.data.me)

      if (!booksQuery.loading && booksQuery.data) {
        setBooks(booksQuery.data.allBooks.filter(b => b.genres.includes(currentUser.favoriteGenre)))
      }
    }
  }, [meQuery, booksQuery, currentUser])

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