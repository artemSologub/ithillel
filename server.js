const http = require('http');
const path = require('path');
const fs = require('fs');

const config = require('config');
const logger = require('./utils/logger')('server');

const port = config.server.defaultPort;

const srv = http.createServer();

srv.listen(port, () => {
  logger.info(`Server is listening on ${port} port`);
});

// srv.on('request', (req, resp) => {
//   if (req.method === 'GET' && req.url === '/healthcheck') {
//     resp.setHeader('content-type', 'text');
//     resp.write('healthcheck passed');
//     logger.info(`${req.method} ${req.url} ${resp.statusCode}`);
//     resp.end();
//     return;
//   }

//   resp.statusCode = 404;
//   logger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
//   resp.end();
// });

const CONTENT_TYPES = {
  js: 'text/javascript',
  css: 'text/css',
  html: 'text/html',
  text: 'text',
};

function sendNotFound(req, resp) {
  logger.warn(`${req.method} ${req.url} ${resp.statusCode}`);
  resp.writeHead(404);
  resp.end();
}

function handleRoot(req, resp) {
  req.url = './static/index.html';
  handleStatic(req, resp);
}

function handleStatic(req, resp) {
  const dataType = CONTENT_TYPES[req.url.split('.').pop()];
  resp.setHeader('content-type', dataType);

  const filePath = path.join(process.cwd(), req.url);
  try {
    fs.accessSync(filePath);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(resp);
  } catch (err) {
    sendNotFound(req, resp);
  }
}

async function parseReqBody(req, resp) {
  const bodyParts = [];

  for await (const chunk of req) {
    bodyParts.push(chunk);
  }

  const incomingJsom = JSON.parse(Buffer.concat(bodyParts).toString());
  req.body = incomingJsom;
}

function handleData(req, resp) {
  logger.info(req.body);
  resp.end('Request data received!');
}

const endpoints = {
  '/': {
    GET: [handleRoot],
  },
  '/data': {
    GET: [],
    POST: [parseReqBody, handleData],
  },
};

srv.on('request', async (req, resp) => {
  if (req.url === '/') {
    return handleRoot(req, resp);
  }

  if (req.url.startsWith('/static') && /\.(css|js|html)$/.test(req.url)) {
    return handleStatic(req, resp);
  }

  if (req.url === '/data') {
    if (req.method === 'POST') {
      const bodyParts = [];

      for await (const chunk of req) {
        bodyParts.push(chunk);
      }

      const incomingJsom = JSON.parse(Buffer.concat(bodyParts).toString());

      console.log('incomingJsom = ', incomingJsom);
      resp.end('Request data received!');
      return;
    }

    if (req.method === 'GET') {
      const filePath = path.join(process.cwd(), 'source', 'test-file1.txt');
      const fileStream = fs.createReadStream(filePath);

      resp.setHeader('content-type', CONTENT_TYPES.text);
      fileStream.pipe(resp);

      return;
    }
  }

  sendNotFound(req, resp);
});
