import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import AuthorBirthyearForm from './components/AuthorBirthyearForm'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { useApolloClient, useSubscription, useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_BOOKS_W_GENRE, BOOKS_SUBSCRIPTION, ME } from './queries'

const App = () => {
  const meQuery = useQuery(ME)

  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setToken(localStorage.getItem('library-app-user-token'))
  }, [])

  useEffect(() => {
    if (!meQuery.loading && meQuery.data.me) {
      setCurrentUser(meQuery.data.me)
    }
  }, [meQuery])

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

      const booksWGenreInStore = client.readQuery({
        query: ALL_BOOKS_W_GENRE,
        variables: { genre: currentUser.favoriteGenre } 
      })
      if (
        newBook.genres &&
        newBook.genres.includes(currentUser.favoriteGenre) && 
        booksWGenreInStore && 
        !booksWGenreInStore.allBooks.map(book => book.id).includes(newBook.id)
        ) {
          client.writeQuery({
            query: ALL_BOOKS_W_GENRE, 
            variables: { genre: currentUser.favoriteGenre },
            data: { allBooks: booksWGenreInStore.allBooks.concat(newBook) }
          })
        }
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

      <Recommendations show={page === 'recommend'} currentUser={currentUser} />

      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />

    </div>
  )
}

export default App