import { gql } from '@apollo/client';

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
            title
            published
        }
    }
`;

export const CREATE_BOOK = gql`
    mutation($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
            author
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