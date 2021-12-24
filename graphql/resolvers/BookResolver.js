const Author = require( '../../models/Author' );

exports.Book = {
  author: async ( root ) => {
    console.log(root)
    return await Author.findOne({ _id: root.author })
  },
};