import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, EDIT_AUTHOR } from '../queries';
import Select from 'react-select'

const EditAuthor = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [error, setError] = useState('')

  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    onError: (error) => {
      setError(error.message)
    }
  })

  const submit = async (event) => {

    if ( born.length < 1 ) {
      setError('Enter age')
      return
    }

    event.preventDefault()
    await editAuthor({ variables: { name: name.value, setBornTo: born } })

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

  const [nameOptions, setNameOptions] = useState([])
  useEffect(() => {
    setNameOptions([])
    const optionObjects = []
    authors.map(a => optionObjects.push({ value: a.name, label: a.name }))
    setNameOptions(optionObjects)
  }, [authors])

  return (
      <>
        <form onSubmit={submit}>
          <h3>Set birthyear </h3>
          <div style={{ marginBottom: 20 }}>
            name
            <Select
                defaultValue={name.value}
                onChange={setName}
                options={nameOptions}
            />
            {/*<input
             value={name}
             onChange={({ target }) => setName(target.value)}
             />*/}
          </div>
          <div style={{ marginBottom: 20 }}>
            born
            <input
                type='number'
                value={born}
                onChange={({ target }) => setBorn(Number(target.value))}
            /><button type='submit'>Update author</button>
          </div>
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
          {localStorage.getItem('library-user-token') && <EditAuthor authors={authors} />}
        </div>
      </div>
  )
}

export default Authors