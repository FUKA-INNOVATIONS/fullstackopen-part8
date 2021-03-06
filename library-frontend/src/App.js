import React, { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommended from './components/Recommended'
import { useApolloClient } from '@apollo/client';

const Notify = ( { errorMessage } ) => {
  if ( !errorMessage ) {
    return null;
  }
  return (
      <div style={ { color: 'red' } }>
        { errorMessage }
      </div>
  );
};

const App = () => {
  const [ page, setPage ] = useState( 'authors' );
  const [ errorMessage, setErrorMessage ] = useState( null );
  const [ token, setToken ] = useState( null );
  const client = useApolloClient();

  const logout = () => {
    setToken( null );
    localStorage.clear();
    client.resetStore();
  };

  const notify = ( message ) => {
    setErrorMessage( message );
    setTimeout( () => {
      setErrorMessage( null );
    }, 10000 );
  };


  return (
      <div>
        <Notify errorMessage={ errorMessage }/>

        {!token && !localStorage.getItem('library-user-token') ? <LoginForm setToken={ setToken } setError={ notify } /> : null}

        <div>
          <button onClick={ () => setPage( 'authors' ) }>authors</button>
          <button onClick={ () => setPage( 'books' ) }>books</button>
          {localStorage.getItem('library-user-token') && <button onClick={ () => setPage( 'add' ) }>add book</button>}
          {localStorage.getItem('library-user-token') && <button onClick={ () => setPage( 'recommended' ) }>Recommended</button>}
          {localStorage.getItem('library-user-token') && <button onClick={ () => logout() }>Sign out</button>}
        </div>

        <Authors
            show={ page === 'authors' }
        />

        { page === 'books' &&
        <Books
            notify={ notify }
        />
        }

        <NewBook
            show={ page === 'add' }
            notify={ notify }
        />

        { page === 'recommended' ?
            <Recommended
                show={ page === 'recommended' }
                token={ token }
            />
        : null}



      </div>
  );
};

export default App;