const Author = require( '../models/Author' );
const Book = require( '../models/Book' );
const User = require( '../models/User' );
const { AuthenticationError, UserInputError } = require( 'apollo-server' );
const jwt = require( 'jsonwebtoken' );

const { PubSub } = require( 'graphql-subscriptions' );
const pubsub = new PubSub()

exports.resolvers = {
  Query: {
    me: async ( root, args, context ) => await context.currentUser,
    authorCount: async () => await Author.collection.countDocuments(),
    bookCount: async ( root ) => await Book.collection.countDocuments(),
    allAuthors: async () => await Author.find( {} ),
    findAuthor: async ( root, args ) => await Author.findOne(
        { name: args.name } ),
    allBooks: async ( root, args ) => {
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
      await pubsub.publish( 'SAY_HI', { bookAdded: book } )
      return books;
    },
  },


  Mutation: {
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
          await pubsub.publish('BOOK_ADDED', {
            title: book.title,
            published: book.published,
            author: book.author,
            genres: book.genres,
            id: book._id
          } )
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
          await pubsub.publish('BOOK_ADDED', {
            title: book.title,
            published: book.published,
            author: book.author,
            genres: book.genres,
            id: book._id
          } )
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
    }
  },


  Book: {
    author: async ( root ) => Author.findOne({ _id: root.author })

  },

  Author: {
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
  },


  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
      // resolve is needed, otherwise null is returned
      resolve: (payload) => payload
    },
    numberIncremented: {
      subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"])
    },
    sayHi: {
      subscribe: () => pubsub.asyncIterator(['SAY_HI'])
    },

    newMessage: {
      subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE']),
      resolve: (payload) => {
        return payload
      }
    }

  }
}