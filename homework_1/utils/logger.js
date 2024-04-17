function info(msg) {
  console.log(msg);
}

function warn(msg) {
  console.error(msg);
}

function error(msg) {
  console.error(msg);
}

function getLogger() {
  return {
    info,
    warn,
    error,
  };
}

module.exports = getLogger;
