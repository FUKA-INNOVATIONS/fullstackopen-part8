const Author = require( '../../models/Author' );

exports.Book = {
  author: async ( root ) => await Author.findOne({ _id: root.author })
};