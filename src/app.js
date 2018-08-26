const express = require('express');
const ApolloServer = require('apollo-server-express').ApolloServer;
const cors = require('cors');

const schema = require('./schema');
const resolvers = require('./resolvers').resolvers;
const users = require('./resolvers').users;

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});