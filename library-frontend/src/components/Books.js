import { useQuery } from '@apollo/client'
import React, { useState } from 'react'

import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const booksQuery = useQuery(ALL_BOOKS)
  const [genreFilter, setGenreFilter] = useState(null)

  if (!show) {
    return null
  }

  const books = booksQuery.loading ? [] : booksQuery.data.allBooks
  const genres = [...new Set(books.map(b => b.genres).flat())]

  return (
    <div>
      <h2>books</h2>

      {genreFilter && <div>in genre <b>{genreFilter}</b></div>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b, i) =>
            (b.genres && b.genres.includes(genreFilter)) || !genreFilter
              ? <tr key={i}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
              : null
          )}
        </tbody>
      </table>

      <div>
        {genres.map((gen, i) => <button key={i} onClick={() => setGenreFilter(gen)}>{gen}</button>)}
        <button onClick={() => setGenreFilter(null)}>all books</button>
      </div>
    </div>
  )
}

export default Books