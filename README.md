initial commit,add express,resolvers,schema graphql

📄 .gitignore
```
node_modules
```

📄 package.json
```json
{
  "name": "graphql-tutorial-1",
  "version": "0.1.0",
  "description": "coba pakai graphql",
  "main": "app.js",
  "scripts": {
    "start": "node ./src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "bm",
  "license": "ISC",
  "dependencies": {
    "apollo-server": "^2.0.5",
    "apollo-server-express": "^2.0.4",
    "cors": "^2.8.4",
    "express": "^4.16.3",
    "graphql": "^0.13.2"
  }
}

```
📄 src/app.js
```js
const express = require('express');
const ApolloServer = require('apollo-server-express').ApolloServer;
const cors = require('cors');

const schema = require('./schema');
const resolvers = require('./resolvers');

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
```
📄 src/resolvers.js
```js
const resolvers = {
  Query: {
    me: () => {
      return {
        username: 'Robin Wieruch',
      };
    },
  },
};

module.exports = resolvers;

```
📄 src/schema.js
```js
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

```
adding user query and field id to User type

📄 src/schema.js
```diff
  const schema = gql`
    type Query {
      me: User
+     user(id: ID!): User
    }
  
    type User {
      username: String!
+     id: ID!
    }
  `;
  

```
adding resolvers for query user based on id

📄 src/resolvers.js
```diff
+ const users = {
+   1: {
+     id: '1',
+     username: 'Robin Wieruch',
+   },
+   2: {
+     id: '2',
+     username: 'Dave Davids',
+   },
+ };
+ 
+ const me = users[1];
+ 
  const resolvers = {
    Query: {
      me: () => {
-       return {
-         username: 'Robin Wieruch',
-       };
+       return me;
+     },
+     user: (parent, { id }) => {
+       return users[id];
      },
    },
  };

```
adding get all user query and resolvers

📄 src/resolvers.js
```diff
      user: (parent, { id }) => {
        return users[id];
      },
+     users: () => {
+       return Object.values(users);
+     },
    },
  };
  

```
📄 src/schema.js
```diff
    type Query {
      me: User
      user(id: ID!): User
+     users: [User!]
    }
  
    type User {

```
adding fullname query on User type

📄 src/schema.js
```diff
  
    type User {
      username: String!
+     fullname: String
      id: ID!
    }
  `;

```
adding fullname resolver on User

📄 src/resolvers.js
```diff
  const users = {
    1: {
      id: '1',
-     username: 'Robin Wieruch',
+     username: 'robinw',
+     firstname: 'Robin',
+     lastname: 'Wieruch',
    },
    2: {
      id: '2',
-     username: 'Dave Davids',
+     username: 'daved',
+     firstname: 'Dave',
+     lastname: 'Davids',
    },
  };
  
        return Object.values(users);
      },
    },
+   User: {
+     fullname: user => `${user.firstname} ${user.lastname}`,
+     username: user => user.username
+   },
  };
  
  module.exports = resolvers;

```
adding context in ApolloServer

📄 src/app.js
```diff
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
+   context: {
+     me: users[1],
+   },
  });
  
  server.applyMiddleware({ app, path: '/graphql' });

```
refactors to use context in resolvers

📄 src/resolvers.js
```diff
  
  const resolvers = {
    Query: {
-     me: () => {
+     me: (parent, args, { me }) => {
        return me;
      },
      user: (parent, { id }) => {

```
adding dev script using nodemon

📄 package.json
```diff
    "main": "app.js",
    "scripts": {
      "start": "node ./src/app.js",
+     "dev": "nodemon ./src/app.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "bm",

```
adding message Query and type

📄 src/schema.js
```diff
      me: User
      user(id: ID!): User
      users: [User!]
+     messages: [Message!]!
+     message(id: ID!): Message!
    }
  
    type User {
      fullname: String
      id: ID!
    }
+ 
+   type Message {
+     id: ID!
+     text: String!
+     user: User!
+   }
  `;
  
  module.exports = schema;

```
adding resolvers for  message query and type

📄 src/resolvers.js
```diff
    },
  };
  
- const me = users[1];
+ let messages = {
+   1: {
+     id: '1',
+     text: 'Hello World',
+   },
+   2: {
+     id: '2',
+     text: 'By World',
+   },
+ };
  
  const resolvers = {
    Query: {
      users: () => {
        return Object.values(users);
      },
+     messages: () => {
+       return Object.values(messages);
+     },
+     message: (parent, { id }) => {
+       return messages[id];
+     },
    },
    User: {
      fullname: user => `${user.firstname} ${user.lastname}`,
      username: user => user.username
    },
+   Message: {
+     user: (parent, args, { me }) => {
+       return me;
+     },
+   },
  };
  
- module.exports = resolvers;
+ module.exports = { resolvers, users };

```
import users to app.js

📄 src/app.js
```diff
  const cors = require('cors');
  
  const schema = require('./schema');
- const resolvers = require('./resolvers');
+ const resolvers = require('./resolvers').resolvers;
+ const users = require('./resolvers').users;
  
  const app = express();
  
  
  const server = new ApolloServer({
    typeDefs: schema,
-   resolvers,
+   resolvers: resolvers,
    context: {
      me: users[1],
    },

```
adding Message type in User's type

📄 src/schema.js
```diff
      username: String!
      fullname: String
      id: ID!
+     messages: [Message!]
    }
  
    type Message {

```
adding resolvers for User and Message  type relationship

📄 src/resolvers.js
```diff
      username: 'robinw',
      firstname: 'Robin',
      lastname: 'Wieruch',
+     messageIds: [1],
    },
    2: {
      id: '2',
      username: 'daved',
      firstname: 'Dave',
      lastname: 'Davids',
+     messageIds: [2],
    },
  };
  
    1: {
      id: '1',
      text: 'Hello World',
+     userId: '1'
    },
    2: {
      id: '2',
      text: 'By World',
+     userId: '2',
    },
  };
  
    },
    User: {
      fullname: user => `${user.firstname} ${user.lastname}`,
-     username: user => user.username
+     username: user => user.username,
+     messages: user => {
+       return Object.values(messages).filter(
+         message => message.userId === user.id,
+       );
+     },
    },
    Message: {
-     user: (parent, args, { me }) => {
-       return me;
+     user: message => {
+       return users[message.userId];
      },
    },
  };

```
adding create and delete message mutation

📄 src/schema.js
```diff
      message(id: ID!): Message!
    }
  
+   type Mutation {
+     createMessage(text: String!): Message!
+     deleteMessage(id: ID!): Boolean!
+   }
+ 
    type User {
      username: String!
      fullname: String

```
adding resolvers for create and delete message

📄 package.json
```diff
      "apollo-server-express": "^2.0.4",
      "cors": "^2.8.4",
      "express": "^4.16.3",
-     "graphql": "^0.13.2"
+     "graphql": "^0.13.2",
+     "uuid": "^3.3.2"
    }
  }

```
📄 src/resolvers.js
```diff
+ const uuidv4 = require('uuid/v4');
+ 
  const users = {
    1: {
      id: '1',
        return messages[id];
      },
    },
+   Mutation: {
+     createMessage: (parent, { text }, { me }) => {
+       const id = uuidv4();
+       const message = {
+         id,
+         text,
+         userId: me.id,
+       };
+ 
+       messages[id] = message;
+       users[me.id].messageIds.push(id);
+ 
+       return message;
+     },
+     deleteMessage: (parent, { id }) => {
+       const { [id]: message, ...otherMessages } = messages;
+ 
+       if (!message) {
+         return false;
+       }
+ 
+       messages = otherMessages;
+ 
+       return true;
+     },
+   },
    User: {
      fullname: user => `${user.firstname} ${user.lastname}`,
      username: user => user.username,

```
adding eslint

📄 .eslintrc.json
```json
{
    "extends": "airbnb-base"
}
```

📄 package.json
```diff
      "express": "^4.16.3",
      "graphql": "^0.13.2",
      "uuid": "^3.3.2"
+   },
+   "devDependencies": {
+     "eslint": "^5.4.0",
+     "eslint-config-airbnb-base": "^13.1.0",
+     "eslint-plugin-import": "^2.14.0"
    }
  }

```
refactoring resolvers

📄 src/resolvers.js
```diff
- const uuidv4 = require('uuid/v4');
- 
- const users = {
-   1: {
-     id: '1',
-     username: 'robinw',
-     firstname: 'Robin',
-     lastname: 'Wieruch',
-     messageIds: [1],
-   },
-   2: {
-     id: '2',
-     username: 'daved',
-     firstname: 'Dave',
-     lastname: 'Davids',
-     messageIds: [2],
-   },
- };
- 
- let messages = {
-   1: {
-     id: '1',
-     text: 'Hello World',
-     userId: '1'
-   },
-   2: {
-     id: '2',
-     text: 'By World',
-     userId: '2',
-   },
- };
- 
- const resolvers = {
-   Query: {
-     me: (parent, args, { me }) => {
-       return me;
-     },
-     user: (parent, { id }) => {
-       return users[id];
-     },
-     users: () => {
-       return Object.values(users);
-     },
-     messages: () => {
-       return Object.values(messages);
-     },
-     message: (parent, { id }) => {
-       return messages[id];
-     },
-   },
-   Mutation: {
-     createMessage: (parent, { text }, { me }) => {
-       const id = uuidv4();
-       const message = {
-         id,
-         text,
-         userId: me.id,
-       };
- 
-       messages[id] = message;
-       users[me.id].messageIds.push(id);
- 
-       return message;
-     },
-     deleteMessage: (parent, { id }) => {
-       const { [id]: message, ...otherMessages } = messages;
- 
-       if (!message) {
-         return false;
-       }
- 
-       messages = otherMessages;
- 
-       return true;
-     },
-   },
-   User: {
-     fullname: user => `${user.firstname} ${user.lastname}`,
-     username: user => user.username,
-     messages: user => {
-       return Object.values(messages).filter(
-         message => message.userId === user.id,
-       );
-     },
-   },
-   Message: {
-     user: message => {
-       return users[message.userId];
-     },
-   },
- };
- 
- module.exports = { resolvers, users };

```
📄 src/resolvers/index.js
```js
const userResolvers = require('./user');
const messageResolvers = require('./message');

module.exports = [userResolvers, messageResolvers];

```
📄 src/resolvers/message.js
```js
const uuidv4 = require('uuid/v4');

const messageResolvers = {
  Query: {
    messages: (parent, args, { models }) => {
      return Object.values(models.messages);
    },
    message: (parent, { id }, { models }) => {
      return models.messages[id];
    },
  },
  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);

      return message;
    },
    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      models.messages = otherMessages;

      return true;
    },
  },
  Message: {
    user: (message, args, { models }) => models.users[message.userId],
  },
};

module.exports = messageResolvers;

```
📄 src/resolvers/user.js
```js
const userResolvers = {
  Query: {
    users: (parent, args, { models }) => {
      return Object.values(models.users);
    },
    user: (parent, { id }, { models }) => {
      return models.users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
  },
  User: {
    fullname: user => `${user.firstname} ${user.lastname}`,
    username: user => user.username,
    messages: (user, args, { models }) => {
      return Object.values(models.messages).filter(
        message => message.userId === user.id,
      );
    },
  },
};

module.exports = userResolvers;

```
refactoring schema

📄 src/schema.js
```diff
- const gql = require('apollo-server-express').gql;
- 
- const schema = gql`
-   type Query {
-     me: User
-     user(id: ID!): User
-     users: [User!]
-     messages: [Message!]!
-     message(id: ID!): Message!
-   }
- 
-   type Mutation {
-     createMessage(text: String!): Message!
-     deleteMessage(id: ID!): Boolean!
-   }
- 
-   type User {
-     username: String!
-     fullname: String
-     id: ID!
-     messages: [Message!]
-   }
- 
-   type Message {
-     id: ID!
-     text: String!
-     user: User!
-   }
- `;
- 
- module.exports = schema;

```
📄 src/schema/index.js
```js
const gql = require('apollo-server-express').gql;
const userSchema = require('./user');
const messageSchema = require('./message');

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [linkSchema, userSchema, messageSchema];

```
📄 src/schema/message.js
```js
const gql = require('apollo-server-express').gql;

const messageSchema = gql`
  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

module.exports = messageSchema;

```
📄 src/schema/user.js
```js
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

```
refactoring models

📄 src/models/index.js
```js
const users = {
  1: {
    id: '1',
    username: 'robinw',
    firstname: 'Robin',
    lastname: 'Wieruch',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'daved',
    firstname: 'Dave',
    lastname: 'Davids',
    messageIds: [2],
  },
};

const messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1'
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

module.exports = { users, messages };

```
refactoring app.js

📄 src/app.js
```diff
  const cors = require('cors');
  
  const schema = require('./schema');
- const resolvers = require('./resolvers').resolvers;
- const users = require('./resolvers').users;
+ const resolvers = require('./resolvers');
+ const models = require('./models');
  
  const app = express();
  
    typeDefs: schema,
    resolvers: resolvers,
    context: {
-     me: users[1],
+     models,
+     me: models.users[1],
    },
  });
  

```