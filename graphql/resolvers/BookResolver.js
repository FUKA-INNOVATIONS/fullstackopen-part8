const Author = require( '../../models/Author' );



exports.Book = {
  author: async ( root ) => Author.findOne({ _id: root.author })

};