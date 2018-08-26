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
📄 package-lock.json
```diff
          "negotiator": "0.6.1"
        }
      },
+     "acorn": {
+       "version": "5.7.2",
+       "resolved": "https://registry.npmjs.org/acorn/-/acorn-5.7.2.tgz",
+       "integrity": "sha512-cJrKCNcr2kv8dlDnbw+JPUGjHZzo4myaxOLmpOX8a+rgX94YeTcTMv/LFJUSByRpc+i4GgVnnhLxvMu/2Y+rqw==",
+       "dev": true
+     },
+     "acorn-jsx": {
+       "version": "4.1.1",
+       "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-4.1.1.tgz",
+       "integrity": "sha512-JY+iV6r+cO21KtntVvFkD+iqjtdpRUpGqKWgfkCdZq1R+kbreEl8EcdcJR4SmiIgsIQT33s6QzheQ9a275Q8xw==",
+       "dev": true,
+       "requires": {
+         "acorn": "5.7.2"
+       }
+     },
+     "ajv": {
+       "version": "6.5.3",
+       "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.5.3.tgz",
+       "integrity": "sha512-LqZ9wY+fx3UMiiPd741yB2pj3hhil+hQc8taf4o2QGRFpWgZ2V5C8HA165DY9sS3fJwsk7uT7ZlFEyC3Ig3lLg==",
+       "dev": true,
+       "requires": {
+         "fast-deep-equal": "2.0.1",
+         "fast-json-stable-stringify": "2.0.0",
+         "json-schema-traverse": "0.4.1",
+         "uri-js": "4.2.2"
+       }
+     },
+     "ajv-keywords": {
+       "version": "3.2.0",
+       "resolved": "https://registry.npmjs.org/ajv-keywords/-/ajv-keywords-3.2.0.tgz",
+       "integrity": "sha1-6GuBnGAs+IIa1jdBNpjx3sAhhHo=",
+       "dev": true
+     },
+     "ansi-escapes": {
+       "version": "3.1.0",
+       "resolved": "https://registry.npmjs.org/ansi-escapes/-/ansi-escapes-3.1.0.tgz",
+       "integrity": "sha512-UgAb8H9D41AQnu/PbWlCofQVcnV4Gs2bBJi9eZPxfU/hgglFh3SMDMENRIqdr7H6XFnXdoknctFByVsCOotTVw==",
+       "dev": true
+     },
+     "ansi-regex": {
+       "version": "2.1.1",
+       "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-2.1.1.tgz",
+       "integrity": "sha1-w7M6te42DYbg5ijwRorn7yfWVN8=",
+       "dev": true
+     },
+     "ansi-styles": {
+       "version": "2.2.1",
+       "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-2.2.1.tgz",
+       "integrity": "sha1-tDLdM1i2NM914eRmQ2gkBTPB3b4=",
+       "dev": true
+     },
      "apollo-cache-control": {
        "version": "0.2.2",
        "resolved": "https://registry.npmjs.org/apollo-cache-control/-/apollo-cache-control-0.2.2.tgz",
          "fast-json-stable-stringify": "2.0.0"
        }
      },
+     "argparse": {
+       "version": "1.0.10",
+       "resolved": "https://registry.npmjs.org/argparse/-/argparse-1.0.10.tgz",
+       "integrity": "sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==",
+       "dev": true,
+       "requires": {
+         "sprintf-js": "1.0.3"
+       }
+     },
      "array-flatten": {
        "version": "1.1.1",
        "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
        "integrity": "sha1-ml9pkFGx5wczKPKgCJaLZOopVdI="
      },
+     "array-union": {
+       "version": "1.0.2",
+       "resolved": "https://registry.npmjs.org/array-union/-/array-union-1.0.2.tgz",
+       "integrity": "sha1-mjRBDk9OPaI96jdb5b5w8kd47Dk=",
+       "dev": true,
+       "requires": {
+         "array-uniq": "1.0.3"
+       }
+     },
+     "array-uniq": {
+       "version": "1.0.3",
+       "resolved": "https://registry.npmjs.org/array-uniq/-/array-uniq-1.0.3.tgz",
+       "integrity": "sha1-r2rId6Jcx/dOBYiUdThY39sk/bY=",
+       "dev": true
+     },
+     "arrify": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/arrify/-/arrify-1.0.1.tgz",
+       "integrity": "sha1-iYUI2iIm84DfkEcoRWhJwVAaSw0=",
+       "dev": true
+     },
      "async-limiter": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/async-limiter/-/async-limiter-1.0.0.tgz",
          "retry": "0.10.1"
        }
      },
+     "babel-code-frame": {
+       "version": "6.26.0",
+       "resolved": "https://registry.npmjs.org/babel-code-frame/-/babel-code-frame-6.26.0.tgz",
+       "integrity": "sha1-Y/1D99weO7fONZR9uP42mj9Yx0s=",
+       "dev": true,
+       "requires": {
+         "chalk": "1.1.3",
+         "esutils": "2.0.2",
+         "js-tokens": "3.0.2"
+       },
+       "dependencies": {
+         "chalk": {
+           "version": "1.1.3",
+           "resolved": "https://registry.npmjs.org/chalk/-/chalk-1.1.3.tgz",
+           "integrity": "sha1-qBFcVeSnAv5NFQq9OHKCKn4J/Jg=",
+           "dev": true,
+           "requires": {
+             "ansi-styles": "2.2.1",
+             "escape-string-regexp": "1.0.5",
+             "has-ansi": "2.0.0",
+             "strip-ansi": "3.0.1",
+             "supports-color": "2.0.0"
+           }
+         },
+         "strip-ansi": {
+           "version": "3.0.1",
+           "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-3.0.1.tgz",
+           "integrity": "sha1-ajhfuIU9lS1f8F0Oiq+UJ43GPc8=",
+           "dev": true,
+           "requires": {
+             "ansi-regex": "2.1.1"
+           }
+         }
+       }
+     },
      "backo2": {
        "version": "1.0.2",
        "resolved": "https://registry.npmjs.org/backo2/-/backo2-1.0.2.tgz",
        "integrity": "sha1-MasayLEpNjRj41s+u2n038+6eUc="
      },
+     "balanced-match": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz",
+       "integrity": "sha1-ibTRmasr7kneFk6gK4nORi1xt2c=",
+       "dev": true
+     },
      "body-parser": {
        "version": "1.18.3",
        "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.18.3.tgz",
          "type-is": "1.6.16"
        }
      },
+     "brace-expansion": {
+       "version": "1.1.11",
+       "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.11.tgz",
+       "integrity": "sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==",
+       "dev": true,
+       "requires": {
+         "balanced-match": "1.0.0",
+         "concat-map": "0.0.1"
+       }
+     },
+     "builtin-modules": {
+       "version": "1.1.1",
+       "resolved": "https://registry.npmjs.org/builtin-modules/-/builtin-modules-1.1.1.tgz",
+       "integrity": "sha1-Jw8HbFpywC9bZaR9+Uxf46J4iS8=",
+       "dev": true
+     },
      "busboy": {
        "version": "0.2.14",
        "resolved": "https://registry.npmjs.org/busboy/-/busboy-0.2.14.tgz",
        "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.0.0.tgz",
        "integrity": "sha1-0ygVQE1olpn4Wk6k+odV3ROpYEg="
      },
+     "caller-path": {
+       "version": "0.1.0",
+       "resolved": "https://registry.npmjs.org/caller-path/-/caller-path-0.1.0.tgz",
+       "integrity": "sha1-lAhe9jWB7NPaqSREqP6U6CV3dR8=",
+       "dev": true,
+       "requires": {
+         "callsites": "0.2.0"
+       }
+     },
+     "callsites": {
+       "version": "0.2.0",
+       "resolved": "https://registry.npmjs.org/callsites/-/callsites-0.2.0.tgz",
+       "integrity": "sha1-r6uWJikQp/M8GaV3WCXGnzTjUMo=",
+       "dev": true
+     },
+     "chalk": {
+       "version": "2.4.1",
+       "resolved": "https://registry.npmjs.org/chalk/-/chalk-2.4.1.tgz",
+       "integrity": "sha512-ObN6h1v2fTJSmUXoS3nMQ92LbDK9be4TV+6G+omQlGJFdcUX5heKi1LZ1YnRMIgwTLEj3E24bT6tYni50rlCfQ==",
+       "dev": true,
+       "requires": {
+         "ansi-styles": "3.2.1",
+         "escape-string-regexp": "1.0.5",
+         "supports-color": "5.5.0"
+       },
+       "dependencies": {
+         "ansi-styles": {
+           "version": "3.2.1",
+           "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz",
+           "integrity": "sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==",
+           "dev": true,
+           "requires": {
+             "color-convert": "1.9.2"
+           }
+         },
+         "supports-color": {
+           "version": "5.5.0",
+           "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
+           "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
+           "dev": true,
+           "requires": {
+             "has-flag": "3.0.0"
+           }
+         }
+       }
+     },
+     "chardet": {
+       "version": "0.4.2",
+       "resolved": "https://registry.npmjs.org/chardet/-/chardet-0.4.2.tgz",
+       "integrity": "sha1-tUc7M9yXxCTl2Y3IfVXU2KKci/I=",
+       "dev": true
+     },
+     "circular-json": {
+       "version": "0.3.3",
+       "resolved": "https://registry.npmjs.org/circular-json/-/circular-json-0.3.3.tgz",
+       "integrity": "sha512-UZK3NBx2Mca+b5LsG7bY183pHWt5Y1xts4P3Pz7ENTwGVnJOUWbRb3ocjvX7hx9tq/yTAdclXm9sZ38gNuem4A==",
+       "dev": true
+     },
+     "cli-cursor": {
+       "version": "2.1.0",
+       "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-2.1.0.tgz",
+       "integrity": "sha1-s12sN2R5+sw+lHR9QdDQ9SOP/LU=",
+       "dev": true,
+       "requires": {
+         "restore-cursor": "2.0.0"
+       }
+     },
+     "cli-width": {
+       "version": "2.2.0",
+       "resolved": "https://registry.npmjs.org/cli-width/-/cli-width-2.2.0.tgz",
+       "integrity": "sha1-/xnt6Kml5XkyQUewwR8PvLq+1jk=",
+       "dev": true
+     },
+     "color-convert": {
+       "version": "1.9.2",
+       "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-1.9.2.tgz",
+       "integrity": "sha512-3NUJZdhMhcdPn8vJ9v2UQJoH0qqoGUkYTgFEPZaPjEtwmmKUfNV46zZmgB2M5M4DCEQHMaCfWHCxiBflLm04Tg==",
+       "dev": true,
+       "requires": {
+         "color-name": "1.1.1"
+       }
+     },
+     "color-name": {
+       "version": "1.1.1",
+       "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.1.tgz",
+       "integrity": "sha1-SxQVMEz1ACjqgWQ2Q72C6gWANok=",
+       "dev": true
+     },
+     "concat-map": {
+       "version": "0.0.1",
+       "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
+       "integrity": "sha1-2Klr13/Wjfd5OnMDajug1UBdR3s=",
+       "dev": true
+     },
+     "contains-path": {
+       "version": "0.1.0",
+       "resolved": "https://registry.npmjs.org/contains-path/-/contains-path-0.1.0.tgz",
+       "integrity": "sha1-/ozxhP9mcLa67wGp1IYaXL7EEgo=",
+       "dev": true
+     },
      "content-disposition": {
        "version": "0.5.2",
        "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.2.tgz",
          "vary": "1.1.2"
        }
      },
+     "cross-spawn": {
+       "version": "6.0.5",
+       "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-6.0.5.tgz",
+       "integrity": "sha512-eTVLrBSt7fjbDygz805pMnstIs2VTBNkRm0qxZd+M7A5XDdxVRWO5MxGBXZhjY4cqLYLdtrGqRf8mBPmzwSpWQ==",
+       "dev": true,
+       "requires": {
+         "nice-try": "1.0.5",
+         "path-key": "2.0.1",
+         "semver": "5.5.1",
+         "shebang-command": "1.2.0",
+         "which": "1.3.1"
+       }
+     },
      "debug": {
        "version": "2.6.9",
        "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
          "ms": "2.0.0"
        }
      },
+     "deep-is": {
+       "version": "0.1.3",
+       "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.3.tgz",
+       "integrity": "sha1-s2nW+128E+7PUk+RsHD+7cNXzzQ=",
+       "dev": true
+     },
      "define-properties": {
        "version": "1.1.3",
        "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.1.3.tgz",
          "object-keys": "1.0.12"
        }
      },
+     "del": {
+       "version": "2.2.2",
+       "resolved": "https://registry.npmjs.org/del/-/del-2.2.2.tgz",
+       "integrity": "sha1-wSyYHQZ4RshLyvhiz/kw2Qf/0ag=",
+       "dev": true,
+       "requires": {
+         "globby": "5.0.0",
+         "is-path-cwd": "1.0.0",
+         "is-path-in-cwd": "1.0.1",
+         "object-assign": "4.1.1",
+         "pify": "2.3.0",
+         "pinkie-promise": "2.0.1",
+         "rimraf": "2.6.2"
+       }
+     },
      "depd": {
        "version": "1.1.2",
        "resolved": "https://registry.npmjs.org/depd/-/depd-1.1.2.tgz",
          "streamsearch": "0.1.2"
        }
      },
+     "doctrine": {
+       "version": "2.1.0",
+       "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz",
+       "integrity": "sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==",
+       "dev": true,
+       "requires": {
+         "esutils": "2.0.2"
+       }
+     },
      "ee-first": {
        "version": "1.1.1",
        "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
        "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-1.0.2.tgz",
        "integrity": "sha1-rT/0yG7C0CkyL1oCw6mmBslbP1k="
      },
+     "error-ex": {
+       "version": "1.3.2",
+       "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.2.tgz",
+       "integrity": "sha512-7dFHNmqeFSEt2ZBsCriorKnn3Z2pj+fd9kmI6QoWw4//DL+icEBfc0U7qJCisqrTsKTjw4fNFy2pW9OqStD84g==",
+       "dev": true,
+       "requires": {
+         "is-arrayish": "0.2.1"
+       }
+     },
      "es-abstract": {
        "version": "1.12.0",
        "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.12.0.tgz",
        "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
        "integrity": "sha1-Aljq5NPQwJdN4cFpGI7wBR0dGYg="
      },
+     "escape-string-regexp": {
+       "version": "1.0.5",
+       "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
+       "integrity": "sha1-G2HAViGQqN/2rjuyzwIAyhMLhtQ=",
+       "dev": true
+     },
+     "eslint": {
+       "version": "5.4.0",
+       "resolved": "https://registry.npmjs.org/eslint/-/eslint-5.4.0.tgz",
+       "integrity": "sha512-UIpL91XGex3qtL6qwyCQJar2j3osKxK9e3ano3OcGEIRM4oWIpCkDg9x95AXEC2wMs7PnxzOkPZ2gq+tsMS9yg==",
+       "dev": true,
+       "requires": {
+         "ajv": "6.5.3",
+         "babel-code-frame": "6.26.0",
+         "chalk": "2.4.1",
+         "cross-spawn": "6.0.5",
+         "debug": "3.1.0",
+         "doctrine": "2.1.0",
+         "eslint-scope": "4.0.0",
+         "eslint-utils": "1.3.1",
+         "eslint-visitor-keys": "1.0.0",
+         "espree": "4.0.0",
+         "esquery": "1.0.1",
+         "esutils": "2.0.2",
+         "file-entry-cache": "2.0.0",
+         "functional-red-black-tree": "1.0.1",
+         "glob": "7.1.2",
+         "globals": "11.7.0",
+         "ignore": "4.0.6",
+         "imurmurhash": "0.1.4",
+         "inquirer": "5.2.0",
+         "is-resolvable": "1.1.0",
+         "js-yaml": "3.12.0",
+         "json-stable-stringify-without-jsonify": "1.0.1",
+         "levn": "0.3.0",
+         "lodash": "4.17.10",
+         "minimatch": "3.0.4",
+         "mkdirp": "0.5.1",
+         "natural-compare": "1.4.0",
+         "optionator": "0.8.2",
+         "path-is-inside": "1.0.2",
+         "pluralize": "7.0.0",
+         "progress": "2.0.0",
+         "regexpp": "2.0.0",
+         "require-uncached": "1.0.3",
+         "semver": "5.5.1",
+         "strip-ansi": "4.0.0",
+         "strip-json-comments": "2.0.1",
+         "table": "4.0.3",
+         "text-table": "0.2.0"
+       },
+       "dependencies": {
+         "debug": {
+           "version": "3.1.0",
+           "resolved": "https://registry.npmjs.org/debug/-/debug-3.1.0.tgz",
+           "integrity": "sha512-OX8XqP7/1a9cqkxYw2yXss15f26NKWBpDXQd0/uK/KPqdQhxbPa994hnzjcE2VqQpDslf55723cKPUOGSmMY3g==",
+           "dev": true,
+           "requires": {
+             "ms": "2.0.0"
+           }
+         }
+       }
+     },
+     "eslint-config-airbnb-base": {
+       "version": "13.1.0",
+       "resolved": "https://registry.npmjs.org/eslint-config-airbnb-base/-/eslint-config-airbnb-base-13.1.0.tgz",
+       "integrity": "sha512-XWwQtf3U3zIoKO1BbHh6aUhJZQweOwSt4c2JrPDg9FP3Ltv3+YfEv7jIDB8275tVnO/qOHbfuYg3kzw6Je7uWw==",
+       "dev": true,
+       "requires": {
+         "eslint-restricted-globals": "0.1.1",
+         "object.assign": "4.1.0",
+         "object.entries": "1.0.4"
+       }
+     },
+     "eslint-import-resolver-node": {
+       "version": "0.3.2",
+       "resolved": "https://registry.npmjs.org/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.2.tgz",
+       "integrity": "sha512-sfmTqJfPSizWu4aymbPr4Iidp5yKm8yDkHp+Ir3YiTHiiDfxh69mOUsmiqW6RZ9zRXFaF64GtYmN7e+8GHBv6Q==",
+       "dev": true,
+       "requires": {
+         "debug": "2.6.9",
+         "resolve": "1.8.1"
+       }
+     },
+     "eslint-module-utils": {
+       "version": "2.2.0",
+       "resolved": "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.2.0.tgz",
+       "integrity": "sha1-snA2LNiLGkitMIl2zn+lTphBF0Y=",
+       "dev": true,
+       "requires": {
+         "debug": "2.6.9",
+         "pkg-dir": "1.0.0"
+       }
+     },
+     "eslint-plugin-import": {
+       "version": "2.14.0",
+       "resolved": "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.14.0.tgz",
+       "integrity": "sha512-FpuRtniD/AY6sXByma2Wr0TXvXJ4nA/2/04VPlfpmUDPOpOY264x+ILiwnrk/k4RINgDAyFZByxqPUbSQ5YE7g==",
+       "dev": true,
+       "requires": {
+         "contains-path": "0.1.0",
+         "debug": "2.6.9",
+         "doctrine": "1.5.0",
+         "eslint-import-resolver-node": "0.3.2",
+         "eslint-module-utils": "2.2.0",
+         "has": "1.0.3",
+         "lodash": "4.17.10",
+         "minimatch": "3.0.4",
+         "read-pkg-up": "2.0.0",
+         "resolve": "1.8.1"
+       },
+       "dependencies": {
+         "doctrine": {
+           "version": "1.5.0",
+           "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-1.5.0.tgz",
+           "integrity": "sha1-N53Ocw9hZvds76TmcHoVmwLFpvo=",
+           "dev": true,
+           "requires": {
+             "esutils": "2.0.2",
+             "isarray": "1.0.0"
+           }
+         },
+         "isarray": {
+           "version": "1.0.0",
+           "resolved": "https://registry.npmjs.org/isarray/-/isarray-1.0.0.tgz",
+           "integrity": "sha1-u5NdSFgsuhaMBoNJV6VKPgcSTxE=",
+           "dev": true
+         }
+       }
+     },
+     "eslint-restricted-globals": {
+       "version": "0.1.1",
+       "resolved": "https://registry.npmjs.org/eslint-restricted-globals/-/eslint-restricted-globals-0.1.1.tgz",
+       "integrity": "sha1-NfDVy8ZMLj7WLpO0saevBbp+1Nc=",
+       "dev": true
+     },
+     "eslint-scope": {
+       "version": "4.0.0",
+       "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-4.0.0.tgz",
+       "integrity": "sha512-1G6UTDi7Jc1ELFwnR58HV4fK9OQK4S6N985f166xqXxpjU6plxFISJa2Ba9KCQuFa8RCnj/lSFJbHo7UFDBnUA==",
+       "dev": true,
+       "requires": {
+         "esrecurse": "4.2.1",
+         "estraverse": "4.2.0"
+       }
+     },
+     "eslint-utils": {
+       "version": "1.3.1",
+       "resolved": "https://registry.npmjs.org/eslint-utils/-/eslint-utils-1.3.1.tgz",
+       "integrity": "sha512-Z7YjnIldX+2XMcjr7ZkgEsOj/bREONV60qYeB/bjMAqqqZ4zxKyWX+BOUkdmRmA9riiIPVvo5x86m5elviOk0Q==",
+       "dev": true
+     },
+     "eslint-visitor-keys": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-1.0.0.tgz",
+       "integrity": "sha512-qzm/XxIbxm/FHyH341ZrbnMUpe+5Bocte9xkmFMzPMjRaZMcXww+MpBptFvtU+79L362nqiLhekCxCxDPaUMBQ==",
+       "dev": true
+     },
+     "espree": {
+       "version": "4.0.0",
+       "resolved": "https://registry.npmjs.org/espree/-/espree-4.0.0.tgz",
+       "integrity": "sha512-kapdTCt1bjmspxStVKX6huolXVV5ZfyZguY1lcfhVVZstce3bqxH9mcLzNn3/mlgW6wQ732+0fuG9v7h0ZQoKg==",
+       "dev": true,
+       "requires": {
+         "acorn": "5.7.2",
+         "acorn-jsx": "4.1.1"
+       }
+     },
+     "esprima": {
+       "version": "4.0.1",
+       "resolved": "https://registry.npmjs.org/esprima/-/esprima-4.0.1.tgz",
+       "integrity": "sha512-eGuFFw7Upda+g4p+QHvnW0RyTX/SVeJBDM/gCtMARO0cLuT2HcEKnTPvhjV6aGeqrCB/sbNop0Kszm0jsaWU4A==",
+       "dev": true
+     },
+     "esquery": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.0.1.tgz",
+       "integrity": "sha512-SmiyZ5zIWH9VM+SRUReLS5Q8a7GxtRdxEBVZpm98rJM7Sb+A9DVCndXfkeFUd3byderg+EbDkfnevfCwynWaNA==",
+       "dev": true,
+       "requires": {
+         "estraverse": "4.2.0"
+       }
+     },
+     "esrecurse": {
+       "version": "4.2.1",
+       "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.2.1.tgz",
+       "integrity": "sha512-64RBB++fIOAXPw3P9cy89qfMlvZEXZkqqJkjqqXIvzP5ezRZjW+lPWjw35UX/3EhUPFYbg5ER4JYgDw4007/DQ==",
+       "dev": true,
+       "requires": {
+         "estraverse": "4.2.0"
+       }
+     },
+     "estraverse": {
+       "version": "4.2.0",
+       "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-4.2.0.tgz",
+       "integrity": "sha1-De4/7TH81GlhjOc0IJn8GvoL2xM=",
+       "dev": true
+     },
+     "esutils": {
+       "version": "2.0.2",
+       "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.2.tgz",
+       "integrity": "sha1-Cr9PHKpbyx96nYrMbepPqqBLrJs=",
+       "dev": true
+     },
      "etag": {
        "version": "1.8.1",
        "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
          }
        }
      },
+     "external-editor": {
+       "version": "2.2.0",
+       "resolved": "https://registry.npmjs.org/external-editor/-/external-editor-2.2.0.tgz",
+       "integrity": "sha512-bSn6gvGxKt+b7+6TKEv1ZycHleA7aHhRHyAqJyp5pbUFuYYNIzpZnQDk7AsYckyWdEnTeAnay0aCy2aV6iTk9A==",
+       "dev": true,
+       "requires": {
+         "chardet": "0.4.2",
+         "iconv-lite": "0.4.23",
+         "tmp": "0.0.33"
+       }
+     },
+     "fast-deep-equal": {
+       "version": "2.0.1",
+       "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-2.0.1.tgz",
+       "integrity": "sha1-ewUhjd+WZ79/Nwv3/bLLFf3Qqkk=",
+       "dev": true
+     },
      "fast-json-stable-stringify": {
        "version": "2.0.0",
        "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.0.0.tgz",
        "integrity": "sha1-1RQsDK7msRifh9OnYREGT4bIu/I="
      },
+     "fast-levenshtein": {
+       "version": "2.0.6",
+       "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
+       "integrity": "sha1-PYpcZog6FqMMqGQ+hR8Zuqd5eRc=",
+       "dev": true
+     },
+     "figures": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/figures/-/figures-2.0.0.tgz",
+       "integrity": "sha1-OrGi0qYsi/tDGgyUy3l6L84nyWI=",
+       "dev": true,
+       "requires": {
+         "escape-string-regexp": "1.0.5"
+       }
+     },
+     "file-entry-cache": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-2.0.0.tgz",
+       "integrity": "sha1-w5KZDD5oR4PYOLjISkXYoEhFg2E=",
+       "dev": true,
+       "requires": {
+         "flat-cache": "1.3.0",
+         "object-assign": "4.1.1"
+       }
+     },
      "finalhandler": {
        "version": "1.1.1",
        "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.1.1.tgz",
          }
        }
      },
+     "find-up": {
+       "version": "1.1.2",
+       "resolved": "https://registry.npmjs.org/find-up/-/find-up-1.1.2.tgz",
+       "integrity": "sha1-ay6YIrGizgpgq2TWEOzK1TyyTQ8=",
+       "dev": true,
+       "requires": {
+         "path-exists": "2.1.0",
+         "pinkie-promise": "2.0.1"
+       }
+     },
+     "flat-cache": {
+       "version": "1.3.0",
+       "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-1.3.0.tgz",
+       "integrity": "sha1-0wMLMrOBVPTjt+nHCfSQ9++XxIE=",
+       "dev": true,
+       "requires": {
+         "circular-json": "0.3.3",
+         "del": "2.2.2",
+         "graceful-fs": "4.1.11",
+         "write": "0.2.1"
+       }
+     },
      "forwarded": {
        "version": "0.1.2",
        "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.1.2.tgz",
        "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
        "integrity": "sha1-PYyt2Q2XZWn6g1qx+OSyOhBWBac="
      },
+     "fs.realpath": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
+       "integrity": "sha1-FQStJSMVjKpA20onh8sBQRmU6k8=",
+       "dev": true
+     },
      "function-bind": {
        "version": "1.1.1",
        "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.1.tgz",
        "integrity": "sha512-yIovAzMX49sF8Yl58fSCWJ5svSLuaibPxXQJFLmBObTuCr0Mf1KiPopGM9NiFjiYBCbfaa2Fh6breQ6ANVTI0A=="
      },
+     "functional-red-black-tree": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/functional-red-black-tree/-/functional-red-black-tree-1.0.1.tgz",
+       "integrity": "sha1-GwqzvVU7Kg1jmdKcDj6gslIHgyc=",
+       "dev": true
+     },
+     "glob": {
+       "version": "7.1.2",
+       "resolved": "https://registry.npmjs.org/glob/-/glob-7.1.2.tgz",
+       "integrity": "sha512-MJTUg1kjuLeQCJ+ccE4Vpa6kKVXkPYJ2mOCQyUuKLcLQsdrMCpBPUi8qVE6+YuaJkozeA9NusTAw3hLr8Xe5EQ==",
+       "dev": true,
+       "requires": {
+         "fs.realpath": "1.0.0",
+         "inflight": "1.0.6",
+         "inherits": "2.0.3",
+         "minimatch": "3.0.4",
+         "once": "1.4.0",
+         "path-is-absolute": "1.0.1"
+       }
+     },
+     "globals": {
+       "version": "11.7.0",
+       "resolved": "https://registry.npmjs.org/globals/-/globals-11.7.0.tgz",
+       "integrity": "sha512-K8BNSPySfeShBQXsahYB/AbbWruVOTyVpgoIDnl8odPpeSfP2J5QO2oLFFdl2j7GfDCtZj2bMKar2T49itTPCg==",
+       "dev": true
+     },
+     "globby": {
+       "version": "5.0.0",
+       "resolved": "https://registry.npmjs.org/globby/-/globby-5.0.0.tgz",
+       "integrity": "sha1-69hGZ8oNuzMLmbz8aOrCvFQ3Dg0=",
+       "dev": true,
+       "requires": {
+         "array-union": "1.0.2",
+         "arrify": "1.0.1",
+         "glob": "7.1.2",
+         "object-assign": "4.1.1",
+         "pify": "2.3.0",
+         "pinkie-promise": "2.0.1"
+       }
+     },
+     "graceful-fs": {
+       "version": "4.1.11",
+       "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.1.11.tgz",
+       "integrity": "sha1-Dovf5NHduIVNZOBOp8AOKgJuVlg=",
+       "dev": true
+     },
      "graphql": {
        "version": "0.13.2",
        "resolved": "https://registry.npmjs.org/graphql/-/graphql-0.13.2.tgz",
          "function-bind": "1.1.1"
        }
      },
+     "has-ansi": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/has-ansi/-/has-ansi-2.0.0.tgz",
+       "integrity": "sha1-NPUEnOHs3ysGSa8+8k5F7TVBbZE=",
+       "dev": true,
+       "requires": {
+         "ansi-regex": "2.1.1"
+       }
+     },
+     "has-flag": {
+       "version": "3.0.0",
+       "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
+       "integrity": "sha1-tdRU3CGZriJWmfNGfloH87lVuv0=",
+       "dev": true
+     },
+     "has-symbols": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.0.tgz",
+       "integrity": "sha1-uhqPGvKg/DllD1yFA2dwQSIGO0Q=",
+       "dev": true
+     },
      "hash.js": {
        "version": "1.1.5",
        "resolved": "https://registry.npmjs.org/hash.js/-/hash.js-1.1.5.tgz",
          "minimalistic-assert": "1.0.1"
        }
      },
+     "hosted-git-info": {
+       "version": "2.7.1",
+       "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-2.7.1.tgz",
+       "integrity": "sha512-7T/BxH19zbcCTa8XkMlbK5lTo1WtgkFi3GvdWEyNuc4Vex7/9Dqbnpsf4JMydcfj9HCg4zUWFTL3Za6lapg5/w==",
+       "dev": true
+     },
      "http-errors": {
        "version": "1.6.3",
        "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-1.6.3.tgz",
          "safer-buffer": "2.1.2"
        }
      },
+     "ignore": {
+       "version": "4.0.6",
+       "resolved": "https://registry.npmjs.org/ignore/-/ignore-4.0.6.tgz",
+       "integrity": "sha512-cyFDKrqc/YdcWFniJhzI42+AzS+gNwmUzOSFcRCQYwySuBBBy/KjuxWLZ/FHEH6Moq1NizMOBWyTcv8O4OZIMg==",
+       "dev": true
+     },
+     "imurmurhash": {
+       "version": "0.1.4",
+       "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
+       "integrity": "sha1-khi5srkoojixPcT7a21XbyMUU+o=",
+       "dev": true
+     },
+     "inflight": {
+       "version": "1.0.6",
+       "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
+       "integrity": "sha1-Sb1jMdfQLQwJvJEKEHW6gWW1bfk=",
+       "dev": true,
+       "requires": {
+         "once": "1.4.0",
+         "wrappy": "1.0.2"
+       }
+     },
      "inherits": {
        "version": "2.0.3",
        "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.3.tgz",
        "integrity": "sha1-Yzwsg+PaQqUC9SRmAiSA9CCCYd4="
      },
+     "inquirer": {
+       "version": "5.2.0",
+       "resolved": "https://registry.npmjs.org/inquirer/-/inquirer-5.2.0.tgz",
+       "integrity": "sha512-E9BmnJbAKLPGonz0HeWHtbKf+EeSP93paWO3ZYoUpq/aowXvYGjjCSuashhXPpzbArIjBbji39THkxTz9ZeEUQ==",
+       "dev": true,
+       "requires": {
+         "ansi-escapes": "3.1.0",
+         "chalk": "2.4.1",
+         "cli-cursor": "2.1.0",
+         "cli-width": "2.2.0",
+         "external-editor": "2.2.0",
+         "figures": "2.0.0",
+         "lodash": "4.17.10",
+         "mute-stream": "0.0.7",
+         "run-async": "2.3.0",
+         "rxjs": "5.5.11",
+         "string-width": "2.1.1",
+         "strip-ansi": "4.0.0",
+         "through": "2.3.8"
+       }
+     },
      "ipaddr.js": {
        "version": "1.8.0",
        "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.8.0.tgz",
        "integrity": "sha1-6qM9bd16zo9/b+DJygRA5wZzix4="
      },
+     "is-arrayish": {
+       "version": "0.2.1",
+       "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
+       "integrity": "sha1-d8mYQFJ6qOyxqLppe4BkWnqSap0=",
+       "dev": true
+     },
+     "is-builtin-module": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/is-builtin-module/-/is-builtin-module-1.0.0.tgz",
+       "integrity": "sha1-VAVy0096wxGfj3bDDLwbHgN6/74=",
+       "dev": true,
+       "requires": {
+         "builtin-modules": "1.1.1"
+       }
+     },
      "is-callable": {
        "version": "1.1.4",
        "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.1.4.tgz",
        "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.0.1.tgz",
        "integrity": "sha1-mqIOtq7rv/d/vTPnTKAbM1gdOhY="
      },
+     "is-fullwidth-code-point": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-2.0.0.tgz",
+       "integrity": "sha1-o7MKXE8ZkYMWeqq5O+764937ZU8=",
+       "dev": true
+     },
+     "is-path-cwd": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/is-path-cwd/-/is-path-cwd-1.0.0.tgz",
+       "integrity": "sha1-0iXsIxMuie3Tj9p2dHLmLmXxEG0=",
+       "dev": true
+     },
+     "is-path-in-cwd": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/is-path-in-cwd/-/is-path-in-cwd-1.0.1.tgz",
+       "integrity": "sha512-FjV1RTW48E7CWM7eE/J2NJvAEEVektecDBVBE5Hh3nM1Jd0kvhHtX68Pr3xsDf857xt3Y4AkwVULK1Vku62aaQ==",
+       "dev": true,
+       "requires": {
+         "is-path-inside": "1.0.1"
+       }
+     },
+     "is-path-inside": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/is-path-inside/-/is-path-inside-1.0.1.tgz",
+       "integrity": "sha1-jvW33lBDej/cprToZe96pVy0gDY=",
+       "dev": true,
+       "requires": {
+         "path-is-inside": "1.0.2"
+       }
+     },
+     "is-promise": {
+       "version": "2.1.0",
+       "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-2.1.0.tgz",
+       "integrity": "sha1-eaKp7OfwlugPNtKy87wWwf9L8/o=",
+       "dev": true
+     },
      "is-regex": {
        "version": "1.0.4",
        "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.0.4.tgz",
          "has": "1.0.3"
        }
      },
+     "is-resolvable": {
+       "version": "1.1.0",
+       "resolved": "https://registry.npmjs.org/is-resolvable/-/is-resolvable-1.1.0.tgz",
+       "integrity": "sha512-qgDYXFSR5WvEfuS5dMj6oTMEbrrSaM0CrFk2Yiq/gXnBvD9pMa2jGXxyhGLfvhZpuMZe18CJpFxAt3CRs42NMg==",
+       "dev": true
+     },
      "is-symbol": {
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.0.1.tgz",
        "resolved": "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
        "integrity": "sha1-ihis/Kmo9Bd+Cav8YDiTmwXR7t8="
      },
+     "isexe": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
+       "integrity": "sha1-6PvzdNxVb/iUehDcsFctYz8s+hA=",
+       "dev": true
+     },
      "iterall": {
        "version": "1.2.2",
        "resolved": "https://registry.npmjs.org/iterall/-/iterall-1.2.2.tgz",
        "integrity": "sha512-yynBb1g+RFUPY64fTrFv7nsjRrENBQJaX2UL+2Szc9REFrSNm1rpSXHGzhmAy7a9uv3vlvgBlXnf9RqmPH1/DA=="
      },
+     "js-tokens": {
+       "version": "3.0.2",
+       "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-3.0.2.tgz",
+       "integrity": "sha1-mGbfOVECEw449/mWvOtlRDIJwls=",
+       "dev": true
+     },
+     "js-yaml": {
+       "version": "3.12.0",
+       "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-3.12.0.tgz",
+       "integrity": "sha512-PIt2cnwmPfL4hKNwqeiuz4bKfnzHTBv6HyVgjahA6mPLwPDzjDWrplJBMjHUFxku/N3FlmrbyPclad+I+4mJ3A==",
+       "dev": true,
+       "requires": {
+         "argparse": "1.0.10",
+         "esprima": "4.0.1"
+       }
+     },
+     "json-schema-traverse": {
+       "version": "0.4.1",
+       "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
+       "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
+       "dev": true
+     },
+     "json-stable-stringify-without-jsonify": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
+       "integrity": "sha1-nbe1lJatPzz+8wp1FC0tkwrXJlE=",
+       "dev": true
+     },
+     "levn": {
+       "version": "0.3.0",
+       "resolved": "https://registry.npmjs.org/levn/-/levn-0.3.0.tgz",
+       "integrity": "sha1-OwmSTt+fCDwEkP3UwLxEIeBHZO4=",
+       "dev": true,
+       "requires": {
+         "prelude-ls": "1.1.2",
+         "type-check": "0.3.2"
+       }
+     },
+     "load-json-file": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/load-json-file/-/load-json-file-2.0.0.tgz",
+       "integrity": "sha1-eUfkIUmvgNaWy/eXvKq8/h/inKg=",
+       "dev": true,
+       "requires": {
+         "graceful-fs": "4.1.11",
+         "parse-json": "2.2.0",
+         "pify": "2.3.0",
+         "strip-bom": "3.0.0"
+       }
+     },
+     "locate-path": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-2.0.0.tgz",
+       "integrity": "sha1-K1aLJl7slExtnA3pw9u7ygNUzY4=",
+       "dev": true,
+       "requires": {
+         "p-locate": "2.0.0",
+         "path-exists": "3.0.0"
+       },
+       "dependencies": {
+         "path-exists": {
+           "version": "3.0.0",
+           "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-3.0.0.tgz",
+           "integrity": "sha1-zg6+ql94yxiSXqfYENe1mwEP1RU=",
+           "dev": true
+         }
+       }
+     },
      "lodash": {
        "version": "4.17.10",
        "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.10.tgz",
          "mime-db": "1.35.0"
        }
      },
+     "mimic-fn": {
+       "version": "1.2.0",
+       "resolved": "https://registry.npmjs.org/mimic-fn/-/mimic-fn-1.2.0.tgz",
+       "integrity": "sha512-jf84uxzwiuiIVKiOLpfYk7N46TSy8ubTonmneY9vrpHNAnp0QBt2BxWV9dO3/j+BoVAb+a5G6YDPW3M5HOdMWQ==",
+       "dev": true
+     },
      "minimalistic-assert": {
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/minimalistic-assert/-/minimalistic-assert-1.0.1.tgz",
        "integrity": "sha512-UtJcAD4yEaGtjPezWuO9wC4nwUnVH/8/Im3yEHQP4b67cXlD/Qr9hdITCU1xDbSEXg2XKNaP8jsReV7vQd00/A=="
      },
+     "minimatch": {
+       "version": "3.0.4",
+       "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.4.tgz",
+       "integrity": "sha512-yJHVQEhyqPLUTgt9B83PXu6W3rx4MvvHvSUvToogpwoGDOUQ+yDrR0HRot+yOCdCO7u4hX3pWft6kWBBcqh0UA==",
+       "dev": true,
+       "requires": {
+         "brace-expansion": "1.1.11"
+       }
+     },
+     "minimist": {
+       "version": "0.0.8",
+       "resolved": "https://registry.npmjs.org/minimist/-/minimist-0.0.8.tgz",
+       "integrity": "sha1-hX/Kv8M5fSYluCKCYuhqp6ARsF0=",
+       "dev": true
+     },
+     "mkdirp": {
+       "version": "0.5.1",
+       "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-0.5.1.tgz",
+       "integrity": "sha1-MAV0OOrGz3+MR2fzhkjWaX11yQM=",
+       "dev": true,
+       "requires": {
+         "minimist": "0.0.8"
+       }
+     },
      "ms": {
        "version": "2.0.0",
        "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
        "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g="
      },
+     "mute-stream": {
+       "version": "0.0.7",
+       "resolved": "https://registry.npmjs.org/mute-stream/-/mute-stream-0.0.7.tgz",
+       "integrity": "sha1-MHXOk7whuPq0PhvE2n6BFe0ee6s=",
+       "dev": true
+     },
+     "natural-compare": {
+       "version": "1.4.0",
+       "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
+       "integrity": "sha1-Sr6/7tdUHywnrPspvbvRXI1bpPc=",
+       "dev": true
+     },
      "negotiator": {
        "version": "0.6.1",
        "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.1.tgz",
        "integrity": "sha1-KzJxhOiZIQEXeyhWP7XnECrNDKk="
      },
+     "nice-try": {
+       "version": "1.0.5",
+       "resolved": "https://registry.npmjs.org/nice-try/-/nice-try-1.0.5.tgz",
+       "integrity": "sha512-1nh45deeb5olNY7eX82BkPO7SSxR5SSYJiPTrTdFUVYwAl8CKMA5N9PjTYkHiRjisVcxcQ1HXdLhx2qxxJzLNQ==",
+       "dev": true
+     },
      "node-fetch": {
        "version": "2.2.0",
        "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.2.0.tgz",
        "integrity": "sha512-OayFWziIxiHY8bCUyLX6sTpDH8Jsbp4FfYd1j1f7vZyfgkcOnAyM4oQR16f8a0s7Gl/viMGRey8eScYk4V4EZA=="
      },
+     "normalize-package-data": {
+       "version": "2.4.0",
+       "resolved": "https://registry.npmjs.org/normalize-package-data/-/normalize-package-data-2.4.0.tgz",
+       "integrity": "sha512-9jjUFbTPfEy3R/ad/2oNbKtW9Hgovl5O1FvFWKkKblNXoN/Oou6+9+KKohPK13Yc3/TyunyWhJp6gvRNR/PPAw==",
+       "dev": true,
+       "requires": {
+         "hosted-git-info": "2.7.1",
+         "is-builtin-module": "1.0.0",
+         "semver": "5.5.1",
+         "validate-npm-package-license": "3.0.4"
+       }
+     },
      "object-assign": {
        "version": "4.1.1",
        "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
        "resolved": "https://registry.npmjs.org/object-path/-/object-path-0.11.4.tgz",
        "integrity": "sha1-NwrnUvvzfePqcKhhwju6iRVpGUk="
      },
+     "object.assign": {
+       "version": "4.1.0",
+       "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.0.tgz",
+       "integrity": "sha512-exHJeq6kBKj58mqGyTQ9DFvrZC/eR6OwxzoM9YRoGBqrXYonaFyGiFMuc9VZrXf7DarreEwMpurG3dd+CNyW5w==",
+       "dev": true,
+       "requires": {
+         "define-properties": "1.1.3",
+         "function-bind": "1.1.1",
+         "has-symbols": "1.0.0",
+         "object-keys": "1.0.12"
+       }
+     },
+     "object.entries": {
+       "version": "1.0.4",
+       "resolved": "https://registry.npmjs.org/object.entries/-/object.entries-1.0.4.tgz",
+       "integrity": "sha1-G/mk3SKI9bM/Opk9JXZh8F0WGl8=",
+       "dev": true,
+       "requires": {
+         "define-properties": "1.1.3",
+         "es-abstract": "1.12.0",
+         "function-bind": "1.1.1",
+         "has": "1.0.3"
+       }
+     },
      "object.getownpropertydescriptors": {
        "version": "2.0.3",
        "resolved": "https://registry.npmjs.org/object.getownpropertydescriptors/-/object.getownpropertydescriptors-2.0.3.tgz",
          "ee-first": "1.1.1"
        }
      },
+     "once": {
+       "version": "1.4.0",
+       "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
+       "integrity": "sha1-WDsap3WWHUsROsF9nFC6753Xa9E=",
+       "dev": true,
+       "requires": {
+         "wrappy": "1.0.2"
+       }
+     },
+     "onetime": {
+       "version": "2.0.1",
+       "resolved": "https://registry.npmjs.org/onetime/-/onetime-2.0.1.tgz",
+       "integrity": "sha1-BnQoIw/WdEOyeUsiu6UotoZ5YtQ=",
+       "dev": true,
+       "requires": {
+         "mimic-fn": "1.2.0"
+       }
+     },
+     "optionator": {
+       "version": "0.8.2",
+       "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.8.2.tgz",
+       "integrity": "sha1-NkxeQJ0/TWMB1sC0wFu6UBgK62Q=",
+       "dev": true,
+       "requires": {
+         "deep-is": "0.1.3",
+         "fast-levenshtein": "2.0.6",
+         "levn": "0.3.0",
+         "prelude-ls": "1.1.2",
+         "type-check": "0.3.2",
+         "wordwrap": "1.0.0"
+       }
+     },
+     "os-tmpdir": {
+       "version": "1.0.2",
+       "resolved": "https://registry.npmjs.org/os-tmpdir/-/os-tmpdir-1.0.2.tgz",
+       "integrity": "sha1-u+Z0BseaqFxc/sdm/lc0VV36EnQ=",
+       "dev": true
+     },
+     "p-limit": {
+       "version": "1.3.0",
+       "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-1.3.0.tgz",
+       "integrity": "sha512-vvcXsLAJ9Dr5rQOPk7toZQZJApBl2K4J6dANSsEuh6QI41JYcsS/qhTGa9ErIUUgK3WNQoJYvylxvjqmiqEA9Q==",
+       "dev": true,
+       "requires": {
+         "p-try": "1.0.0"
+       }
+     },
+     "p-locate": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-2.0.0.tgz",
+       "integrity": "sha1-IKAQOyIqcMj9OcwuWAaA893l7EM=",
+       "dev": true,
+       "requires": {
+         "p-limit": "1.3.0"
+       }
+     },
+     "p-try": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/p-try/-/p-try-1.0.0.tgz",
+       "integrity": "sha1-y8ec26+P1CKOE/Yh8rGiN8GyB7M=",
+       "dev": true
+     },
+     "parse-json": {
+       "version": "2.2.0",
+       "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-2.2.0.tgz",
+       "integrity": "sha1-9ID0BDTvgHQfhGkJn43qGPVaTck=",
+       "dev": true,
+       "requires": {
+         "error-ex": "1.3.2"
+       }
+     },
      "parseurl": {
        "version": "1.3.2",
        "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.2.tgz",
        "integrity": "sha1-/CidTtiZMRlGDBViUyYs3I3mW/M="
      },
+     "path-exists": {
+       "version": "2.1.0",
+       "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-2.1.0.tgz",
+       "integrity": "sha1-D+tsZPD8UY2adU3V77YscCJ2H0s=",
+       "dev": true,
+       "requires": {
+         "pinkie-promise": "2.0.1"
+       }
+     },
+     "path-is-absolute": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
+       "integrity": "sha1-F0uSaHNVNP+8es5r9TpanhtcX18=",
+       "dev": true
+     },
+     "path-is-inside": {
+       "version": "1.0.2",
+       "resolved": "https://registry.npmjs.org/path-is-inside/-/path-is-inside-1.0.2.tgz",
+       "integrity": "sha1-NlQX3t5EQw0cEa9hAn+s8HS9/FM=",
+       "dev": true
+     },
+     "path-key": {
+       "version": "2.0.1",
+       "resolved": "https://registry.npmjs.org/path-key/-/path-key-2.0.1.tgz",
+       "integrity": "sha1-QRyttXTFoUDTpLGRDUDYDMn0C0A=",
+       "dev": true
+     },
+     "path-parse": {
+       "version": "1.0.6",
+       "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.6.tgz",
+       "integrity": "sha512-GSmOT2EbHrINBf9SR7CDELwlJ8AENk3Qn7OikK4nFYAu3Ote2+JYNVvkpAEQm3/TLNEJFD/xZJjzyxg3KBWOzw==",
+       "dev": true
+     },
      "path-to-regexp": {
        "version": "0.1.7",
        "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.7.tgz",
        "integrity": "sha1-32BBeABfUi8V60SQ5yR6G/qmf4w="
      },
+     "path-type": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/path-type/-/path-type-2.0.0.tgz",
+       "integrity": "sha1-8BLMuEFbcJb8LaoQVMPXI4lZTHM=",
+       "dev": true,
+       "requires": {
+         "pify": "2.3.0"
+       }
+     },
+     "pify": {
+       "version": "2.3.0",
+       "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
+       "integrity": "sha1-7RQaasBDqEnqWISY59yosVMw6Qw=",
+       "dev": true
+     },
+     "pinkie": {
+       "version": "2.0.4",
+       "resolved": "https://registry.npmjs.org/pinkie/-/pinkie-2.0.4.tgz",
+       "integrity": "sha1-clVrgM+g1IqXToDnckjoDtT3+HA=",
+       "dev": true
+     },
+     "pinkie-promise": {
+       "version": "2.0.1",
+       "resolved": "https://registry.npmjs.org/pinkie-promise/-/pinkie-promise-2.0.1.tgz",
+       "integrity": "sha1-ITXW36ejWMBprJsXh3YogihFD/o=",
+       "dev": true,
+       "requires": {
+         "pinkie": "2.0.4"
+       }
+     },
+     "pkg-dir": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/pkg-dir/-/pkg-dir-1.0.0.tgz",
+       "integrity": "sha1-ektQio1bstYp1EcFb/TpyTFM89Q=",
+       "dev": true,
+       "requires": {
+         "find-up": "1.1.2"
+       }
+     },
+     "pluralize": {
+       "version": "7.0.0",
+       "resolved": "https://registry.npmjs.org/pluralize/-/pluralize-7.0.0.tgz",
+       "integrity": "sha512-ARhBOdzS3e41FbkW/XWrTEtukqqLoK5+Z/4UeDaLuSW+39JPeFgs4gCGqsrJHVZX0fUrx//4OF0K1CUGwlIFow==",
+       "dev": true
+     },
+     "prelude-ls": {
+       "version": "1.1.2",
+       "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.1.2.tgz",
+       "integrity": "sha1-IZMqVJ9eUv/ZqCf1cOBL5iqX2lQ=",
+       "dev": true
+     },
+     "progress": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/progress/-/progress-2.0.0.tgz",
+       "integrity": "sha1-ihvjZr+Pwj2yvSPxDG/pILQ4nR8=",
+       "dev": true
+     },
      "protobufjs": {
        "version": "6.8.8",
        "resolved": "https://registry.npmjs.org/protobufjs/-/protobufjs-6.8.8.tgz",
        "resolved": "https://registry.npmjs.org/pseudomap/-/pseudomap-1.0.2.tgz",
        "integrity": "sha1-8FKijacOYYkX7wqKw0wa5aaChrM="
      },
+     "punycode": {
+       "version": "2.1.1",
+       "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.1.1.tgz",
+       "integrity": "sha512-XRsRjdf+j5ml+y/6GKHPZbrF/8p2Yga0JPtdqTIY2Xe5ohJPD9saDJJLPvp9+NSBprVvevdXZybnj2cv8OEd0A==",
+       "dev": true
+     },
      "qs": {
        "version": "6.5.2",
        "resolved": "https://registry.npmjs.org/qs/-/qs-6.5.2.tgz",
          "unpipe": "1.0.0"
        }
      },
+     "read-pkg": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/read-pkg/-/read-pkg-2.0.0.tgz",
+       "integrity": "sha1-jvHAYjxqbbDcZxPEv6xGMysjaPg=",
+       "dev": true,
+       "requires": {
+         "load-json-file": "2.0.0",
+         "normalize-package-data": "2.4.0",
+         "path-type": "2.0.0"
+       }
+     },
+     "read-pkg-up": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/read-pkg-up/-/read-pkg-up-2.0.0.tgz",
+       "integrity": "sha1-a3KoBImE4MQeeVEP1en6mbO1Sb4=",
+       "dev": true,
+       "requires": {
+         "find-up": "2.1.0",
+         "read-pkg": "2.0.0"
+       },
+       "dependencies": {
+         "find-up": {
+           "version": "2.1.0",
+           "resolved": "https://registry.npmjs.org/find-up/-/find-up-2.1.0.tgz",
+           "integrity": "sha1-RdG35QbHF93UgndaK3eSCjwMV6c=",
+           "dev": true,
+           "requires": {
+             "locate-path": "2.0.0"
+           }
+         }
+       }
+     },
      "readable-stream": {
        "version": "1.1.14",
        "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-1.1.14.tgz",
        "resolved": "https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.12.1.tgz",
        "integrity": "sha512-odxIc1/vDlo4iZcfXqRYFj0vpXFNoGdKMAUieAlFYO6m/nl5e9KR/beGf41z4a1FI+aQgtjhuaSlDxQ0hmkrHg=="
      },
+     "regexpp": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/regexpp/-/regexpp-2.0.0.tgz",
+       "integrity": "sha512-g2FAVtR8Uh8GO1Nv5wpxW7VFVwHcCEr4wyA8/MHiRkO8uHoR5ntAA8Uq3P1vvMTX/BeQiRVSpDGLd+Wn5HNOTA==",
+       "dev": true
+     },
+     "require-uncached": {
+       "version": "1.0.3",
+       "resolved": "https://registry.npmjs.org/require-uncached/-/require-uncached-1.0.3.tgz",
+       "integrity": "sha1-Tg1W1slmL9MeQwEcS5WqSZVUIdM=",
+       "dev": true,
+       "requires": {
+         "caller-path": "0.1.0",
+         "resolve-from": "1.0.1"
+       }
+     },
+     "resolve": {
+       "version": "1.8.1",
+       "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.8.1.tgz",
+       "integrity": "sha512-AicPrAC7Qu1JxPCZ9ZgCZlY35QgFnNqc+0LtbRNxnVw4TXvjQ72wnuL9JQcEBgXkI9JM8MsT9kaQoHcpCRJOYA==",
+       "dev": true,
+       "requires": {
+         "path-parse": "1.0.6"
+       }
+     },
+     "resolve-from": {
+       "version": "1.0.1",
+       "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-1.0.1.tgz",
+       "integrity": "sha1-Jsv+k10a7uq7Kbw/5a6wHpPUQiY=",
+       "dev": true
+     },
+     "restore-cursor": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-2.0.0.tgz",
+       "integrity": "sha1-n37ih/gv0ybU/RYpI9YhKe7g368=",
+       "dev": true,
+       "requires": {
+         "onetime": "2.0.1",
+         "signal-exit": "3.0.2"
+       }
+     },
      "retry": {
        "version": "0.10.1",
        "resolved": "https://registry.npmjs.org/retry/-/retry-0.10.1.tgz",
        "integrity": "sha1-52OI0heZLCUnUCQdPTlW/tmNj/Q="
      },
+     "rimraf": {
+       "version": "2.6.2",
+       "resolved": "https://registry.npmjs.org/rimraf/-/rimraf-2.6.2.tgz",
+       "integrity": "sha512-lreewLK/BlghmxtfH36YYVg1i8IAce4TI7oao75I1g245+6BctqTVQiBP3YUJ9C6DQOXJmkYR9X9fCLtCOJc5w==",
+       "dev": true,
+       "requires": {
+         "glob": "7.1.2"
+       }
+     },
+     "run-async": {
+       "version": "2.3.0",
+       "resolved": "https://registry.npmjs.org/run-async/-/run-async-2.3.0.tgz",
+       "integrity": "sha1-A3GrSuC91yDUFm19/aZP96RFpsA=",
+       "dev": true,
+       "requires": {
+         "is-promise": "2.1.0"
+       }
+     },
+     "rxjs": {
+       "version": "5.5.11",
+       "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-5.5.11.tgz",
+       "integrity": "sha512-3bjO7UwWfA2CV7lmwYMBzj4fQ6Cq+ftHc2MvUe+WMS7wcdJ1LosDWmdjPQanYp2dBRj572p7PeU81JUxHKOcBA==",
+       "dev": true,
+       "requires": {
+         "symbol-observable": "1.0.1"
+       },
+       "dependencies": {
+         "symbol-observable": {
+           "version": "1.0.1",
+           "resolved": "https://registry.npmjs.org/symbol-observable/-/symbol-observable-1.0.1.tgz",
+           "integrity": "sha1-g0D8RwLDEi310iKI+IKD9RPT/dQ=",
+           "dev": true
+         }
+       }
+     },
      "safe-buffer": {
        "version": "5.1.1",
        "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.1.tgz",
        "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
        "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg=="
      },
+     "semver": {
+       "version": "5.5.1",
+       "resolved": "https://registry.npmjs.org/semver/-/semver-5.5.1.tgz",
+       "integrity": "sha512-PqpAxfrEhlSUWge8dwIp4tZnQ25DIOthpiaHNIthsjEFQD6EvqUKUDM7L8O2rShkFccYo1VjJR0coWfNkCubRw==",
+       "dev": true
+     },
      "send": {
        "version": "0.16.2",
        "resolved": "https://registry.npmjs.org/send/-/send-0.16.2.tgz",
        "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.1.0.tgz",
        "integrity": "sha512-BvE/TwpZX4FXExxOxZyRGQQv651MSwmWKZGqvmPcRIjDqWub67kTKuIMx43cZZrS/cBBzwBcNDWoFxt2XEFIpQ=="
      },
+     "shebang-command": {
+       "version": "1.2.0",
+       "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-1.2.0.tgz",
+       "integrity": "sha1-RKrGW2lbAzmJaMOfNj/uXer98eo=",
+       "dev": true,
+       "requires": {
+         "shebang-regex": "1.0.0"
+       }
+     },
+     "shebang-regex": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-1.0.0.tgz",
+       "integrity": "sha1-2kL0l0DAtC2yypcoVxyxkMmO/qM=",
+       "dev": true
+     },
+     "signal-exit": {
+       "version": "3.0.2",
+       "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.2.tgz",
+       "integrity": "sha1-tf3AjxKH6hF4Yo5BXiUTK3NkbG0=",
+       "dev": true
+     },
+     "slice-ansi": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/slice-ansi/-/slice-ansi-1.0.0.tgz",
+       "integrity": "sha512-POqxBK6Lb3q6s047D/XsDVNPnF9Dl8JSaqe9h9lURl0OdNqy/ujDrOiIHtsqXMGbWWTIomRzAMaTyawAU//Reg==",
+       "dev": true,
+       "requires": {
+         "is-fullwidth-code-point": "2.0.0"
+       }
+     },
+     "spdx-correct": {
+       "version": "3.0.0",
+       "resolved": "https://registry.npmjs.org/spdx-correct/-/spdx-correct-3.0.0.tgz",
+       "integrity": "sha512-N19o9z5cEyc8yQQPukRCZ9EUmb4HUpnrmaL/fxS2pBo2jbfcFRVuFZ/oFC+vZz0MNNk0h80iMn5/S6qGZOL5+g==",
+       "dev": true,
+       "requires": {
+         "spdx-expression-parse": "3.0.0",
+         "spdx-license-ids": "3.0.0"
+       }
+     },
+     "spdx-exceptions": {
+       "version": "2.1.0",
+       "resolved": "https://registry.npmjs.org/spdx-exceptions/-/spdx-exceptions-2.1.0.tgz",
+       "integrity": "sha512-4K1NsmrlCU1JJgUrtgEeTVyfx8VaYea9J9LvARxhbHtVtohPs/gFGG5yy49beySjlIMhhXZ4QqujIZEfS4l6Cg==",
+       "dev": true
+     },
+     "spdx-expression-parse": {
+       "version": "3.0.0",
+       "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.0.tgz",
+       "integrity": "sha512-Yg6D3XpRD4kkOmTpdgbUiEJFKghJH03fiC1OPll5h/0sO6neh2jqRDVHOQ4o/LMea0tgCkbMgea5ip/e+MkWyg==",
+       "dev": true,
+       "requires": {
+         "spdx-exceptions": "2.1.0",
+         "spdx-license-ids": "3.0.0"
+       }
+     },
+     "spdx-license-ids": {
+       "version": "3.0.0",
+       "resolved": "https://registry.npmjs.org/spdx-license-ids/-/spdx-license-ids-3.0.0.tgz",
+       "integrity": "sha512-2+EPwgbnmOIl8HjGBXXMd9NAu02vLjOO1nWw4kmeRDFyHn+M/ETfHxQUK0oXg8ctgVnl9t3rosNVsZ1jG61nDA==",
+       "dev": true
+     },
+     "sprintf-js": {
+       "version": "1.0.3",
+       "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.0.3.tgz",
+       "integrity": "sha1-BOaSb2YolTVPPdAVIDYzuFcpfiw=",
+       "dev": true
+     },
      "statuses": {
        "version": "1.5.0",
        "resolved": "https://registry.npmjs.org/statuses/-/statuses-1.5.0.tgz",
        "resolved": "https://registry.npmjs.org/streamsearch/-/streamsearch-0.1.2.tgz",
        "integrity": "sha1-gIudDlb8Jz2Am6VzOOkpkZoanxo="
      },
+     "string-width": {
+       "version": "2.1.1",
+       "resolved": "https://registry.npmjs.org/string-width/-/string-width-2.1.1.tgz",
+       "integrity": "sha512-nOqH59deCq9SRHlxq1Aw85Jnt4w6KvLKqWVik6oA9ZklXLNIOlqg4F2yrT1MVaTjAqvVwdfeZ7w7aCvJD7ugkw==",
+       "dev": true,
+       "requires": {
+         "is-fullwidth-code-point": "2.0.0",
+         "strip-ansi": "4.0.0"
+       }
+     },
      "string_decoder": {
        "version": "0.10.31",
        "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-0.10.31.tgz",
        "integrity": "sha1-YuIDvEF2bGwoyfyEMB2rHFMQ+pQ="
      },
+     "strip-ansi": {
+       "version": "4.0.0",
+       "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-4.0.0.tgz",
+       "integrity": "sha1-qEeQIusaw2iocTibY1JixQXuNo8=",
+       "dev": true,
+       "requires": {
+         "ansi-regex": "3.0.0"
+       },
+       "dependencies": {
+         "ansi-regex": {
+           "version": "3.0.0",
+           "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-3.0.0.tgz",
+           "integrity": "sha1-7QMXwyIGT3lGbAKWa922Bas32Zg=",
+           "dev": true
+         }
+       }
+     },
+     "strip-bom": {
+       "version": "3.0.0",
+       "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
+       "integrity": "sha1-IzTBjpx1n3vdVv3vfprj1YjmjtM=",
+       "dev": true
+     },
+     "strip-json-comments": {
+       "version": "2.0.1",
+       "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-2.0.1.tgz",
+       "integrity": "sha1-PFMZQukIwml8DsNEhYwobHygpgo=",
+       "dev": true
+     },
      "subscriptions-transport-ws": {
        "version": "0.9.14",
        "resolved": "https://registry.npmjs.org/subscriptions-transport-ws/-/subscriptions-transport-ws-0.9.14.tgz",
          "ws": "5.2.2"
        }
      },
+     "supports-color": {
+       "version": "2.0.0",
+       "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-2.0.0.tgz",
+       "integrity": "sha1-U10EXOa2Nj+kARcIRimZXp3zJMc=",
+       "dev": true
+     },
      "symbol-observable": {
        "version": "1.2.0",
        "resolved": "https://registry.npmjs.org/symbol-observable/-/symbol-observable-1.2.0.tgz",
        "integrity": "sha512-e900nM8RRtGhlV36KGEU9k65K3mPb1WV70OdjfxlG2EAuM1noi/E/BaW/uMhL7bPEssK8QV57vN3esixjUvcXQ=="
      },
+     "table": {
+       "version": "4.0.3",
+       "resolved": "https://registry.npmjs.org/table/-/table-4.0.3.tgz",
+       "integrity": "sha512-S7rnFITmBH1EnyKcvxBh1LjYeQMmnZtCXSEbHcH6S0NoKit24ZuFO/T1vDcLdYsLQkM188PVVhQmzKIuThNkKg==",
+       "dev": true,
+       "requires": {
+         "ajv": "6.5.3",
+         "ajv-keywords": "3.2.0",
+         "chalk": "2.4.1",
+         "lodash": "4.17.10",
+         "slice-ansi": "1.0.0",
+         "string-width": "2.1.1"
+       }
+     },
+     "text-table": {
+       "version": "0.2.0",
+       "resolved": "https://registry.npmjs.org/text-table/-/text-table-0.2.0.tgz",
+       "integrity": "sha1-f17oI66AUgfACvLfSoTsP8+lcLQ=",
+       "dev": true
+     },
+     "through": {
+       "version": "2.3.8",
+       "resolved": "https://registry.npmjs.org/through/-/through-2.3.8.tgz",
+       "integrity": "sha1-DdTJ/6q8NXlgsbckEV1+Doai4fU=",
+       "dev": true
+     },
+     "tmp": {
+       "version": "0.0.33",
+       "resolved": "https://registry.npmjs.org/tmp/-/tmp-0.0.33.tgz",
+       "integrity": "sha512-jRCJlojKnZ3addtTOjdIqoRuPEKBvNXcGYqzO6zWZX8KfKEpnGY5jfggJQ3EjKuu8D4bJRr0y+cYJFmYbImXGw==",
+       "dev": true,
+       "requires": {
+         "os-tmpdir": "1.0.2"
+       }
+     },
+     "type-check": {
+       "version": "0.3.2",
+       "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.3.2.tgz",
+       "integrity": "sha1-WITKtRLPHTVeP7eE8wgEsrUg23I=",
+       "dev": true,
+       "requires": {
+         "prelude-ls": "1.1.2"
+       }
+     },
      "type-is": {
        "version": "1.6.16",
        "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.16.tgz",
        "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
        "integrity": "sha1-sr9O6FFKrmFltIF4KdIbLvSZBOw="
      },
+     "uri-js": {
+       "version": "4.2.2",
+       "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.2.2.tgz",
+       "integrity": "sha512-KY9Frmirql91X2Qgjry0Wd4Y+YTdrdZheS8TFwvkbLWf/G5KNJDCh6pKL5OZctEW4+0Baa5idK2ZQuELRwPznQ==",
+       "dev": true,
+       "requires": {
+         "punycode": "2.1.1"
+       }
+     },
      "util.promisify": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/util.promisify/-/util.promisify-1.0.0.tgz",
        "resolved": "https://registry.npmjs.org/uuid/-/uuid-3.3.2.tgz",
        "integrity": "sha512-yXJmeNaw3DnnKAOKJE51sL/ZaYfWJRl1pK9dr19YFCu0ObS231AB1/LbqTKRAQ5kw8A90rA6fr4riOUpTZvQZA=="
      },
+     "validate-npm-package-license": {
+       "version": "3.0.4",
+       "resolved": "https://registry.npmjs.org/validate-npm-package-license/-/validate-npm-package-license-3.0.4.tgz",
+       "integrity": "sha512-DpKm2Ui/xN7/HQKCtpZxoRWBhZ9Z0kqtygG8XCgNQ8ZlDnxuQmWhj566j8fN4Cu3/JmbhsDo7fcAJq4s9h27Ew==",
+       "dev": true,
+       "requires": {
+         "spdx-correct": "3.0.0",
+         "spdx-expression-parse": "3.0.0"
+       }
+     },
      "vary": {
        "version": "1.1.2",
        "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
        "integrity": "sha1-IpnwLG3tMNSllhsLn3RSShj2NPw="
      },
+     "which": {
+       "version": "1.3.1",
+       "resolved": "https://registry.npmjs.org/which/-/which-1.3.1.tgz",
+       "integrity": "sha512-HxJdYWq1MTIQbJ3nw0cqssHoTNU267KlrDuGZ1WYlxDStUtKUhOaJmh112/TZmHxxUfuJqPXSOm7tDyas0OSIQ==",
+       "dev": true,
+       "requires": {
+         "isexe": "2.0.0"
+       }
+     },
+     "wordwrap": {
+       "version": "1.0.0",
+       "resolved": "https://registry.npmjs.org/wordwrap/-/wordwrap-1.0.0.tgz",
+       "integrity": "sha1-J1hIEIkUVqQXHI0CJkQa3pDLyus=",
+       "dev": true
+     },
+     "wrappy": {
+       "version": "1.0.2",
+       "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
+       "integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8=",
+       "dev": true
+     },
+     "write": {
+       "version": "0.2.1",
+       "resolved": "https://registry.npmjs.org/write/-/write-0.2.1.tgz",
+       "integrity": "sha1-X8A4KOJkzqP+kUVUdvejxWbLB1c=",
+       "dev": true,
+       "requires": {
+         "mkdirp": "0.5.1"
+       }
+     },
      "ws": {
        "version": "5.2.2",
        "resolved": "https://registry.npmjs.org/ws/-/ws-5.2.2.tgz",

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