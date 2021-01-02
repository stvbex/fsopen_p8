import { useQuery } from '@apollo/client'
import React from 'react'

import { ALL_BOOKS_NO_GEN } from '../queries'

const Books = (props) => {
  const booksQuery = useQuery(ALL_BOOKS_NO_GEN)

  if (!props.show) {
    return null
  }

  const books = booksQuery.loading ? [] : booksQuery.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books