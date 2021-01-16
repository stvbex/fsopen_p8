import { useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import Select from 'react-select'

import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

const AuthorBirthyearForm = ({ show }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [selectedAuthor, setSelectedAuthor] = useState(null)

  const allAuthorsQuery = useQuery(ALL_AUTHORS)
  const authors = allAuthorsQuery.loading ? [] : allAuthorsQuery.data.allAuthors

  const selectAuthorOptions = authors.map(author => {
    return {
      value: author.name,
      label: author.name
    }
  })

  const [setBirthyear, ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!show) {
    return null
  }

  const handleSelectChange = selectedOption => {
    setSelectedAuthor(selectedOption)
    setName(selectedOption.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    setBirthyear({ variables: { name, born: Number(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Select 
            defaultValue={selectedAuthor}
            onChange={handleSelectChange}
            options={selectAuthorOptions}
            />
        </div>
        <div>
          born <input value={born} onChange={event => setBorn(event.target.value)} />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorBirthyearForm