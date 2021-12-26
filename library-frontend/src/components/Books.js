import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client';
import { ALL_BOOKS, BOOK_ADDED } from '../queries';

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [filter, setFilter] = useState(null)

  const client = useApolloClient()

  // function for updating cache
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
        set.map(p => p.title).includes(object.title)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    console.log(dataInStore)
    console.log(client)
    // Check, is added book already existing?
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }
  }


  // Subscribe, get data and refresh memory
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      props.notify(`New book '${addedBook.title}' added`)
      updateCacheWith(addedBook)
    }
  })

  useEffect(() => {
    if ( !result.loading ) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  // Create a list of non-duplicated values of all genres
  useEffect(() => {
    setGenres([])
    const genresDistinct = []
    setGenres(books.map(book => book.genres.map(genre => {
      !genresDistinct.includes(genre) && genresDistinct.push(genre)
    })))
    setGenres(genresDistinct)
  }, [books])


  if (result.loading)  {
    return <div>loading...</div>
  }

  // button clickhandler to set filter
  const filterBooks = filter => setFilter(filter)

  const filteredBooks = filter ? books.filter(book => book.genres.includes(filter)) : books

  return (
    <div>
      <h2>books</h2>

      <div>
        <h4>Genres | <button onClick={() => setFilter(null)}>Reset filter</button></h4>
        {genres.map(genre => <button onClick={() => filterBooks(genre)} key={genre} style={{marginRight: 10, marginBottom: 20}}>{genre}</button>)}
      </div>

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
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books