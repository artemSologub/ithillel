const userService = require('../services/user_service');

function getUsers(req, resp) {
  const userList = userService.getUsers();
  resp.send(userList);
}

module.exports = {
  getUsers,
};
