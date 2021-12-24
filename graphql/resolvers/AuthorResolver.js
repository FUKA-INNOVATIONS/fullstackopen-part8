const Author = require( '../../models/Author' );
const Book = require( '../../models/Book' );

exports.Author = {
  bookCount: async ( root ) => {
    const author = await Author.findOne( { name: root.name } );
    if ( author ) {
      const authorBooks = await Book.find( { author: author._id } ).
          countDocuments();
      const authorId = author._id;
      return authorBooks;
    }
    return null;
  },
  allBooks: async ( root ) => {
    console.log("authorResolver > allBooks")
    await Book.find({ author: root._id })
  }
};