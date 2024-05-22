const { Router } = require('express');

const {
  userIdValidator,
  userDataValidator,
} = require('../middlewares/validators');

const userRouter = Router();

userRouter.get('/', (req, resp) => {
  resp.send([]);
});

userRouter.get('/:userId', userIdValidator, (req, resp) => {
  resp.send(`{ userId: ${req.params.userId} }`);
});

userRouter.post('/', userDataValidator, (req, resp) => {
  resp.status(201).send('User created!');
});

userRouter.delete('/:userId', userIdValidator, (req, resp) => {
  resp.status(204).send();
});

module.exports = {
  userRouter,
};
