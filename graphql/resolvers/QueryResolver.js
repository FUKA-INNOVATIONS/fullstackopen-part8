const Author = require( '../../models/Author' );
const Book = require( '../../models/Book' );

const { PubSub } = require( 'graphql-subscriptions' );
const pubsub = new PubSub()

exports.Query = {
  me: async ( root, args, context ) => await context.currentUser,
  authorCount: async () => await Author.collection.countDocuments(),
  bookCount: async ( root ) => await Book.collection.countDocuments(),
  allAuthors: async () => await Author.find( {} ),
  findAuthor: async ( root, args ) => await Author.findOne(
      { name: args.name } ),
  allBooks: async ( root, args ) => {
    const books = await Book.find( {} );
    await pubsub.publish('NEW_MESSAGE', {msg: 'asdasd'});
    if ( args.author && args.genre ) {
      const authorFound = await Author.findOne( { name: args.author } );
      const authorBooks = await Book.find( { author: authorFound._id } );
      return authorBooks.filter( book => book.genres.includes( args.genre ) );
    }
    if ( args.genre ) {
      const books = await Book.find( {} );
      return books.filter( book => book.genres.includes( args.genre ) );
    }
    if ( !args.author ) {
      return books;
    }
    if ( args.author ) {
      const authorFound = await Author.findOne( { name: args.author } );
      return Book.find( { author: authorFound._id } );
    }
    await pubsub.publish( 'SAY_HI', { bookAdded: book } )
    return books;
  },
};