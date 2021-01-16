import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      author {
        id
        name
      }
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!, 
    $author: String!, 
    $published: Int!,
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
    }
  }
`

export const SET_BIRTHYEAR = gql`
  mutation SetBirthyear($name: String!, $born: Int!) {
    editAuthor(
      name: $name
      setBornTo: $born
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!){
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const BOOKS_SUBSCRIPTION = gql`
  subscription BookAdded {
    bookAdded {
      id
      title
      author {
        name
      }
      published
    }
  }
`