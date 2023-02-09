const users = require('./users/users.service.js');
const toDo = require('./to-do/to-do.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(toDo);
};
