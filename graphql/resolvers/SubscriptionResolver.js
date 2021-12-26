const { PubSub } = require( 'graphql-subscriptions' );
const pubsub = new PubSub()

exports.Subscription = {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    resolve: (payload) => {
      return payload
    }
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