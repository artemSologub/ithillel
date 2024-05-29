const { Router } = require('express');
const userService = require('../services/user_service');

const pagesRouter = Router();

pagesRouter.get('/', (_req, resp) => {
  const users = userService.getUsers();
  resp.render('index', { users });
});

module.exports = {
  pagesRouter,
};
