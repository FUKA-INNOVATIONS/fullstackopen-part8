import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [filter, setFilter] = useState(null)

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

  if (!props.show) {
    return null
  }

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