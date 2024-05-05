const config = require('config');
const fs = require('fs');
const path = require('path');
const { bgBlue, bgYellow, bgRed } = require('colors/safe');

const colorsEnabled = config.colorsEnabled === '1';
const logLevel = config.logLevel;

function getLogger(moduleName) {
  return {
    info: (...args) => {
      checkLogFolder('info', ...args);

      if (logLevel !== 'info') {
        return;
      }

      return console.log(
        colorsEnabled ? bgBlue(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    warn: (...args) => {
      checkLogFolder('error', ...args);

      if (logLevel === 'error') {
        return;
      }

      return console.error(
        colorsEnabled ? bgYellow(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    error: (...args) => {
      checkLogFolder('error', ...args);

      console.error(
        colorsEnabled ? bgRed(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
  };
}

function checkLogFolder(executor, content) {
  const logFolder = path.join('.', 'logs');

  fs.access(logFolder, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(logFolder, { recursive: true }, (err) => {
        if (err) {
          getLogger('logger').error('Error creating target folder:', err);
          return;
        } else {
          getLogger('logger').warn(`Folder [${logFolder}] created!`);
          initLogWriting(executor, content);
        }
      });
    } else {
      initLogWriting(executor, content);
    }
  });
}

function initLogWriting(executor, content) {
  switch (executor) {
    case 'info':
      writeInLog('info', content);
    case 'error':
      writeInLog('error', content);
  }
}

function writeInLog(executor, content) {
  const date = new Date().toISOString();

  const writeInfoStream = fs.createWriteStream(`./logs/${executor}.log`);
  writeInfoStream.write(`${date}: ${content}`);
  writeInfoStream.on('close', () => {
    writeInfoStream.close();
  });
}

module.exports = getLogger;
