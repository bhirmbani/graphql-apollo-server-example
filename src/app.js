const express = require('express');
const ApolloServer = require('apollo-server-express').ApolloServer;
const cors = require('cors');

const schema = require('./schema');
const resolvers = require('./resolvers');
const models = require('./models');

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  context: {
    models,
    me: models.users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});