const config = require('config');
const { bgBlue, bgYellow, bgRed } = require('colors/safe');

const colorsEnabled = config.colorsEnabled;
const logLevel = config.logLevel;

function getLogger(moduleName) {
  return {
    info: (...args) => {
      if (logLevel === 'error' || logLevel === 'warn') {
        return;
      }

      return console.log(
        colorsEnabled === 1 ? bgYellow(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    warn: (...args) => {
      if (logLevel === 'error') {
        return;
      }

      return console.error(
        colorsEnabled === 1 ? bgYellow(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    error: (...args) =>
      console.error(
        colorsEnabled === 1 ? bgRed(`${moduleName}:`) : `${moduleName}:`,
        ...args
      ),
  };
}

module.exports = getLogger;
