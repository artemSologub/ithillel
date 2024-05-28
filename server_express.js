const config = require('config');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const logger = require('./utils/logger')('express srv');
const { userRouter } = require('./routers/users');
const { pagesRouter } = require('./routers/pages');

const app = express();
app.listen(config.server.defaultPort, () =>
  logger.info(`server is listening on [${config.server.defaultPort}] port`)
);

// by default take templates from 'views' directory
app.set('view engine', 'pug');

// server access log middleware
const accessLogger = morgan(':date :method :url :status');
app.use(accessLogger);

app.use(express.static('static'));

const jsonBodyParser = express.json();
app.use(jsonBodyParser);

app.use('/users', cors(), userRouter);

app.use('/', pagesRouter);
