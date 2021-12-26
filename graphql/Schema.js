const { gql } = require( 'apollo-server' );

exports.typeDefs = gql`

    type Query {
        authorCount: Int!
        bookCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]
        findAuthor(name: String!): Author
        me: User
        
        newMessage: Message
        testSubscription: String
    }

    type Mutation {
        addBook(
            title: String!,
            author: String!,
            published: Int!,
            genres: [String!]!
        ): Book
        editAuthor(
            name: String!,
            setBornTo: Int!
        ): Author

        createAuthor(
            name: String!,
            born: Int
        ): Author

        createUser(
            username: String!
            favoriteGenre: String!
        ): User

        login(
            username: String!
            password: String!
        ): Token
    }

    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
        allBooks: [Book!]!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]
        id: ID!
    }

    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

    enum AuthorGenre {
        AUTHOR
        GENRE
    }
    
    type Message {
        msg: String
    }

    type Subscription {
        newMessage: Message
        bookAdded: Book!
        numberIncremented: Int
        sayHi: String
    }
    
`;