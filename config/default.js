const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  colorsEnabled: process.env.COLORS_ENABLED || 0,
  logLevel: process.env.LOG_LEVEL || 'warn',
  defaultPort: Number(process.env.DEFAULT_PORT) || 3000,
};
