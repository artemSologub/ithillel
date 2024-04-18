function info(prefix) {
  return (msg) => {
    console.log(`${prefix}: ${msg}`);
  };
}

function warn(prefix) {
  return (msg) => {
    console.error(`${prefix}: ${msg}`);
  };
}

function error(prefix) {
  return (msg) => {
    console.error(`${prefix}: ${msg}`);
  };
}

function getLogger(prefix) {
  return {
    info: info(prefix),
    warn: warn(prefix),
    error: error(prefix),
  };
}

module.exports = getLogger;
