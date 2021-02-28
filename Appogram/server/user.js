const users = {};

exports.create =  (socket,newId) => {
      const id =  newId;
      users[id] = socket;
      return id;
};

exports.get = (id) => users[id];

exports.remove = (id) => delete users[id];