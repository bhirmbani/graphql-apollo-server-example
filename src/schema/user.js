const gql = require('apollo-server-express').gql;

const userSchema = gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User {
    id: ID!
    fullname: String
    username: String!
    messages: [Message!]
  }
`;

module.exports = userSchema;
