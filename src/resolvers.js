const uuidv4 = require('uuid/v4');

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

let messages = {
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

const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id];
    },
    users: () => {
      return Object.values(users);
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },
  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    },
  },
  User: {
    fullname: user => `${user.firstname} ${user.lastname}`,
    username: user => user.username,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },
  Message: {
    user: message => {
      return users[message.userId];
    },
  },
};

module.exports = { resolvers, users };
