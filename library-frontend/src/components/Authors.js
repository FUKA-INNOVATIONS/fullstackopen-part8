import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_AUTHOR } from '../queries';

const EditAuthor = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [error, setError] = useState('')

  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: name, setBornTo: born } })

    setName('')
    setBorn('')

    setInterval(() => {
      setError('')
    }, 3000)
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('Author not found')
    }
  }, [result.data, setError])

  return (
      <>
        <form onSubmit={submit}>
          <h3>Set birthyear </h3>
          <div>
            name
            <input
                value={name}
                onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div>
            born
            <input
                type='number'
                value={born}
                onChange={({ target }) => setBorn(Number(target.value))}
            />
          </div>
          <button type='submit'>Update author</button>
        </form>
        <p style={{color: 'red'}}>{error}</p>
      </>
  )
}

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    if ( !result.loading ) {
      setAuthors(result.data.allAuthors)
    }
  }, [result])

  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <br />
      <div>
        <EditAuthor />
      </div>

    </div>
  )
}

export default Authors