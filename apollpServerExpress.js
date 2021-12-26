require( 'dotenv' ).config();
const { v1: uuid } = require( 'uuid' );
const mongoose = require( 'mongoose' );
const { typeDefs } = require( './graphql/Schema' );
const { resolvers } = require( './graphql/Resolver' );
const User = require( './models/User' );
const jwt = require( 'jsonwebtoken' );


  const { PubSub } = require( 'graphql-subscriptions' );  // Subscription
  const { ApolloServer } = require( 'apollo-server-express' );  // Subscription
const { ApolloServerPluginDrainHttpServer } = require( 'apollo-server-core' );
  const express = require( 'express' ); // Subscription
const http = require( 'http' );
  const { createServer } = require( 'http' ); // Subscription
  const { SubscriptionServer } = require( 'subscriptions-transport-ws' ); // Subscription
  const { makeExecutableSchema } = require( '@graphql-tools/schema' );  // Subscription
  const { execute, subscribe } = require( 'graphql' );  // Subscription



mongoose.connect( process.env.MONGODB_URI ).then( () => {
  console.log( 'connected to MongoDB' );
} ).catch( ( error ) => {
  console.log( 'error connection to MongoDB:', error.message );
} );

( async function() {
  const pubsub = new PubSub();
  const app = express();
  //const httpServer = http.createServer(app);
  const httpServer = createServer( app );

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
      { schema, execute, subscribe },
      { server: httpServer, path: '/graphql' }
  );

  const server = new ApolloServer( {
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    /*plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],*/
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

  /*const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
  });*/

  await server.start();
  server.applyMiddleware( { app } );

  const PORT = 4000;
  httpServer.listen( PORT, () =>
      console.log(
          `Server is now running on http://localhost:${ PORT }/graphql` ),
  );

  //console.log( 'SubSer: ', subscriptionServer.server );

  //await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  //console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
} )();

//startApolloServer()