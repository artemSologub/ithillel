const yup = require('yup');

const userDataSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
});

const userIdSchema = yup.number({
  userId: yup.number().required().positive().integer(),
});

const userDataValidator = async (req, resp, next) => {
  try {
    await userDataSchema.validate(req.body);
  } catch (err) {
    resp.status(400).send(`Not valid data! ${err}`);
  }

  next();
};

const userIdValidator = async (req, resp, next) => {
  try {
    await userIdSchema.validate(Number(req.params.userId));
  } catch (err) {
    resp.status(400).send(`Not valid userId! ${err}`);
  }

  next();
};

module.exports = {
  userDataValidator,
  userIdValidator,
};
