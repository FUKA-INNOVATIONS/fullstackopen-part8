const Author = require( '../../models/Author' );
const Book = require( '../../models/Book' );
const { UserInputError, AuthenticationError } = require( 'apollo-server' );
const User = require( '../../models/User' );
const jwt = require( 'jsonwebtoken' );

exports.Mutation = {
  addBook: async ( root, args, { currentUser } ) => {
    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    const authorFound = await Author.findOne( { name: args.author } );

    if ( authorFound === null ) {
      const newAuthor = await new Author( { name: args.author } );
      const newAuthorId = newAuthor._id;
      const book = new Book( { ...args, author: newAuthorId } );
      try {
        await book.save();
        await newAuthor.save();
        return book;
      } catch ( error ) {
        throw new UserInputError( error.message, {
          invalidArgs: args,
        } );
      }
    } else {
      const book = new Book( { ...args, author: authorFound._id } );
      try {
        await book.save();
        return book;
      } catch ( error ) {
        throw new UserInputError( error.message, {
          invalidArgs: args,
        } );
      }
    }
  },
  editAuthor: async ( root, args, { currentUser } ) => {
    if (!currentUser) {
      throw new AuthenticationError("not authenticated")
    }

    const updatedAuthor = await Author.findOne( { name: args.name } );
    if ( updatedAuthor === null ) {
      return null;
    }
    try {
      updatedAuthor.born = args.setBornTo;
      await updatedAuthor.save();
      return updatedAuthor;
    } catch ( error ) {
      throw new UserInputError( error.message, {
        invalidArgs: args,
      } );
    }
  },
  createUser: ( root, args ) => { //
    const user = new User( { ...args } );
    return user.save().catch( error => {
      throw new UserInputError( error.message, {
        invalidArgs: args,
      } );
    } );
  },
  login: async ( root, args ) => {
    const user = await User.findOne( { username: args.username } );

    if ( !user || args.password !== 'secret' ) {
      throw new UserInputError( 'wrong credentials' );
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    return { value: jwt.sign( userForToken, process.env.JWT_SECRET ) };
  },
  createAuthor: ( root, args ) => {
    const author = new Author( { ...args } );
    return author.save().catch( error => {
      throw new UserInputError( error.message, {
        invalidArgs: args,
      } );
    } );
  },
};