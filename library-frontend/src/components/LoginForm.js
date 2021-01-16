import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, loginResult] = useMutation(LOGIN, {
    onError: error => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (loginResult.data) {
      const token = loginResult.data.login.value
      setToken(token)
      localStorage.setItem('library-app-user-token', token)
      setPage('authors')
    }
  }, [loginResult.data, setToken, setPage])

  const handleSubmit = event => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username:
          <input
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          password:
          <input
            type='password'
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>

        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm