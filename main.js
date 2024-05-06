const logger = require('./utils/logger')('main');

require('./file_sync').start();

logger.info('to log info');
logger.error('to log error');
