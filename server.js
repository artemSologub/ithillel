const http = require('http');
const fs = require('fs');
const path = require('path');

const logger = require('./utils/logger')('server');

const port = 3333;

const srv = http.createServer();

srv.listen(port);

srv.on('request', (req, resp) => {
  console.log('req.method', req.method);
  if (req.method !== 'GET' && req.url !== '/healthcheck') {
    console.log('here');
    try {
      resp.statusCode = 404;
      logger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
      resp.end();
      return;
    } catch (err) {
      resp.statusCode = 404;
      logger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
      resp.end();
    }
  }

  if (req.method === 'GET' && req.url === '/healthcheck') {
    try {
      resp.setHeader('content-type', 'text');
      resp.write('healthcheck passed');
      logger.info(`${req.method} ${req.url} ${resp.statusCode}`);
      resp.end();
      return;
    } catch (err) {
      resp.statusCode = 404;
      logger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
      resp.end();
    }
  }

  resp.statusCode = 404;
  logger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
  resp.end();
});