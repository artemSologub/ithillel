const config = require('config');

const express = require('express');
const morgan = require('morgan');

const logger = require('./utils/logger')('express srv');
const { userRouter } = require('./routers/users');

const app = express();
app.listen(config.server.defaultPort, () =>
  logger.info(`server is listening on [${config.server.defaultPort}] port`)
);

// server access log middleware
const accessLogger = morgan(':date :method :url :status');
app.use(accessLogger);

const jsonBodyParser = express.json();
app.use(jsonBodyParser);

app.use('/users', userRouter);
