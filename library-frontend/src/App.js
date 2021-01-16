import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import AuthorBirthyearForm from './components/AuthorBirthyearForm'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOKS_SUBSCRIPTION } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('library-app-user-token'))
  }, [])

  useSubscription(BOOKS_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded
      window.alert(`Book ${newBook.title} by ${newBook.author.name} added to the list!`)
      
      // update cache
      const booksInStore = client.readQuery({ query: ALL_BOOKS })
      if (booksInStore && !booksInStore.allBooks.map(book => book.id).includes(newBook.id)) {
        client.writeQuery({
          query: ALL_BOOKS,
          data: { allBooks: booksInStore.allBooks.concat(newBook) }
        })
      }

      // works but, data loss warning
      // const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
      // if (authorsInStore && !authorsInStore.allAuthors.map(author => author.id).includes(newBook.author.id)) {
      //   client.writeQuery({
      //     query: ALL_AUTHORS,
      //     data: { allAuthors: authorsInStore.allAuthors.concat(newBook.author) }
      //   })
      // }
    }
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('library-app-user-token')
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={handleLogout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} />
      <AuthorBirthyearForm show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendations show={page === 'recommend'} />

      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />

    </div>
  )
}

export default App