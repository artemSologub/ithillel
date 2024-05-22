const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  logger: {
    colorsEnabled: process.env.COLORS_ENABLED || 0,
    logLevel: process.env.LOG_LEVEL || 'warn',
  },
  server: {
    defaultPort: Number(process.env.DEFAULT_PORT) || 3000,
  },
};
