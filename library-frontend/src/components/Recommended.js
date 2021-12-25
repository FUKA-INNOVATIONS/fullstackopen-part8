import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { AUTHENTICATED_USER, BOOKS_BY_GENRE } from '../queries';

const Recommended = props => {
  const [books, setBooks] = useState([])
  const [user, setUser] = useState(null)
  const userQuery = useQuery(AUTHENTICATED_USER)

  const result = useQuery(BOOKS_BY_GENRE, {
    variables: {genre: user ? user.favoriteGenre : 'nre'}
  })

  useEffect( () => {
      if ( !userQuery.loading) {
        setUser(userQuery.data.me)
      }
  }, [userQuery])

  useEffect(() => {
    if ( !result.loading) {
      setBooks(result.data.allBooks)
    }
  }, [result])


  if (!props.show) {
    return null
  }

  if (result.loading || userQuery.loading)  {
    return <div>loading...</div>
  }

  return (
      <div>
        <h2>books</h2>
        <h4>Manually refresh browser to get filterdByGenre(user.favorite)</h4>

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
          {books.map(b =>
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  )
}

export default Recommended