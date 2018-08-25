const gql = require('apollo-server-express').gql;

const schema = gql`
  type Query {
    me: User
  }

  type User {
    username: String!
  }
`;

module.exports = schema;
