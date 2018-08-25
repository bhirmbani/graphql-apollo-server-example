const gql = require('apollo-server-express').gql;

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    username: String!
    id: ID!
  }
`;

module.exports = schema;
