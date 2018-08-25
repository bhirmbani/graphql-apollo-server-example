const users = {
  1: {
    id: '1',
    username: 'robinw',
    firstname: 'Robin',
    lastname: 'Wieruch',
  },
  2: {
    id: '2',
    username: 'daved',
    firstname: 'Dave',
    lastname: 'Davids',
  },
};

const me = users[1];

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
  },
  User: {
    fullname: user => `${user.firstname} ${user.lastname}`,
    username: user => user.username
  },
};

module.exports = resolvers;
