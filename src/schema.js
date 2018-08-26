const gql = require('apollo-server-express').gql;

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    username: String!
    fullname: String
    id: ID!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

module.exports = schema;
