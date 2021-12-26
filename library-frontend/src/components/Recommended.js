import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { AUTHENTICATED_USER, BOOKS_BY_GENRE } from '../queries';

const Recommended = props => {
  const [books, setBooks] = useState([])
  const [user, setUser] = useState(null)
  const [getUser, userResult] = useLazyQuery(AUTHENTICATED_USER)

  const result = useQuery(BOOKS_BY_GENRE, {
    variables: {genre: user ? user.favoriteGenre : 'nre'}
  })



  useEffect(async () => {
      await getUser().then(u => {
        console.log('uuuu', u)
        setUser(u.data.me)
      })
  }, [props.show, props.token])

  useEffect(() => {
    if ( !result.loading) {
      setBooks(result.data.allBooks)
    }
  }, [result])


  if (!props.show) {
    return null
  }

  if (result.loading )  {
    return <div>loading...</div>
  }


  return (
      <div>
        <h2>books</h2>

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