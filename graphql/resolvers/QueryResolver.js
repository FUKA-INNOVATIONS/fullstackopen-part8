const Author = require( '../../models/Author' );
const Book = require( '../../models/Book' );

exports.Query = {
  me: ( root, args, context ) => context.currentUser,
  authorCount: async () => await Author.collection.countDocuments(),
  bookCount: async ( root ) => await Book.collection.countDocuments(),
  allAuthors: async () => Author.find( {} ),
  findAuthor: async ( root, args ) => await Author.findOne(
      { name: args.name } ),
  allBooks: async ( root, args ) => {
    console.log("QueryResolver > allBooks")
    const books = await Book.find( {} );
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
    return books;
  },
};