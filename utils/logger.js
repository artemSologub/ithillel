const config = require('config');
const { bgBlue, bgYellow, bgRed } = require('colors/safe');

const colorsEnabled = config.colorsEnabled === '1';
const logLevel = config.logLevel;

function getLogger(moduleName) {
  return {
    info: (...args) => {
      if (logLevel === 'error' || logLevel === 'warn') {
        return;
      }

      return console.log(
        colorsEnabled ? bgYellow(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    warn: (...args) => {
      if (logLevel === 'error') {
        return;
      }

      return console.error(
        colorsEnabled ? bgYellow(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    error: (...args) =>
      console.error(
        colorsEnabled ? bgRed(`${moduleName}:`) : `${moduleName}:`,
        ...args
      ),
  };
}

module.exports = getLogger;
