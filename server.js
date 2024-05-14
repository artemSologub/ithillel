const http = require('http');

const config = require('config');
const logger = require('./utils/logger')('server');

const port = config.defaultPort;

const srv = http.createServer();

srv.listen(port, () => {
  logger.info(`Server is listening on ${port} port`);
});

srv.on('request', (req, resp) => {
  if (req.method === 'GET' && req.url === '/healthcheck') {
    resp.setHeader('content-type', 'text');
    resp.write('healthcheck passed');
    logger.info(`${req.method} ${req.url} ${resp.statusCode}`);
    resp.end();
    return;
  }

  resp.statusCode = 404;
  logger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
  resp.end();
});
