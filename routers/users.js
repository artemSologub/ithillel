const { Router } = require('express');
const userController = require('../controllers/user_controller');
const {
  userIdValidator,
  userDataValidator,
} = require('../middlewares/validators');

const userRouter = Router();

userRouter.get('/', userController.getUsers);

userRouter.get('/:userId', userIdValidator, (req, resp) => {
  resp.send(`{ userId: ${req.params.userId} }`);
});

userRouter.post('/', userDataValidator, (req, resp) => {
  resp.status(201).send('User created!');
});

userRouter.delete('/:userId', userIdValidator, (req, resp) => {
  resp.status(204).send();
});

userRouter.use((req, resp) => {
  resp.status(404).send();
});

module.exports = {
  userRouter,
};
