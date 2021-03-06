import { gql } from '@apollo/client';

// Fragment
export const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        author {
            name
        }
        genres
    }
`



// Subscriptions

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

// End Subscriptions



export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`;

export const ALL_AUTHOR_NAMES = gql`
    query {
        allAuthors {
            name
        }
    }
`;

// TODO: Fix and add author name

export const ALL_BOOKS = gql`
    query {
        allBooks {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`;

export const CREATE_BOOK = gql`
    mutation($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
            author {
                name
            }
            published
            genres
        }
    }
`;

export const EDIT_AUTHOR = gql`
    mutation($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
            bookCount
        }
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
            value
        }
    }
`;

export const AUTHENTICATED_USER = gql`
    query {
        me {
            username
            id
            favoriteGenre
        }
    }
`;

export const BOOKS_BY_GENRE = gql`
    query AllBooks($genre: String) {
        allBooks(genre: $genre) {
            title

            author {
                name
            }
            published
        }
    }
`;