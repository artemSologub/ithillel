const fs = require('fs');
const path = require('path');

const logger = require('./utils/logger')('file_sync');

function fileSync() {
  return {
    start: () => {
      const sourceFolder = path.join('.', 'source');
      const targetFolder = path.join('.', 'target');

      fileSync().copyCatalog(sourceFolder, targetFolder);
    },
    copyCatalog: (source, target) => {
      fs.readdir(source, (err, files) => {
        if (err) {
          logger.error('Error reading source directory:', err);
          return;
        }

        // Check if the folder exists
        fs.access(target, fs.constants.F_OK, (err) => {
          if (err) {
            // Create if not
            fs.mkdir(target, { recursive: true }, (err) => {
              if (err) {
                logger.error('Error creating target folder:', err);
                return;
              }
              copyFiles(files);
            });
          } else {
            copyFiles(files);
          }
        });

        function copyFiles(files) {
          files.forEach((file) => {
            const sourcePath = path.join(source, file);
            const targetPath = path.join(target, file);
            fs.stat(sourcePath, (err, stats) => {
              if (err) {
                logger.error('Error stating file:', err);
                return;
              }

              if (stats.isDirectory()) {
                fileSync().copyCatalog(sourcePath, targetPath);
              } else {
                fs.exists(targetPath, (exists) => {
                  if (exists) {
                    logger.warn('File exists!');
                  } else {
                    fs.copyFile(sourcePath, targetPath, (err) => {
                      if (err) {
                        logger.error('Error copying file:', err);
                        return;
                      }
                      logger.info('File copied successfully:', targetPath);
                    });
                  }
                });
              }
            });
          });
        }
      });
    },
  };
}

module.exports = fileSync();
