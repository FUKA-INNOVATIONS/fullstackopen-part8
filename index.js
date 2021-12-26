require( 'dotenv' ).config();
const { ApolloServer } = require( 'apollo-server' );
const { v1: uuid } = require( 'uuid' );
const mongoose = require( 'mongoose' );
const User = require( './models/User' );
const jwt = require( 'jsonwebtoken' );
const { typeDefs } = require( './graphql/Schema' );
const { Query } = require( './graphql/resolvers/QueryResolver' );
const { Mutation } = require( './graphql/resolvers/MutationResolver' );
const { Author } = require( './graphql/resolvers/AuthorResolver' );
const { Book } = require( './graphql/resolvers/BookResolver' );

console.log( 'connecting to', process.env.MONGODB_URI );

mongoose.connect( process.env.MONGODB_URI ).then( () => {
  console.log( 'connected to MongoDB' );
} ).catch( ( error ) => {
  console.log( 'error connection to MongoDB:', error.message );
} );

// TODO: fix > _id not found
// TODO: username toLowerCase comparison
// TODO: add book id to user books. for authenticated user

const server = new ApolloServer( {
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Author,
    Book,
  },
  playground: {
    settings: {
      'editor.theme': 'light',
    },
  },
  context: async ( { req } ) => {
    const auth = req ? req.headers.authorization : null;
    if ( auth && auth.toLowerCase().startsWith( 'bearer ' ) ) {
      const decodedToken = jwt.verify(
          auth.substring( 7 ), process.env.JWT_SECRET,
      );
      const currentUser = await User.findById( decodedToken.id ).
          populate( 'books' );
      return { currentUser };
    }
  },
} );

server.listen( { port: 4000 } ).then( ( { url } ) => {
  console.log( `Server ready at ${ url }` );
} );