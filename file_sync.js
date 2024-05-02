const fs = require('fs');
const path = require('path');

const logger = require('./utils/logger')('file_sync');

function start() {
  const sourceFolder = path.join('.', 'source');
  const targetFolder = path.join('.', 'target');

  copyCatalog(sourceFolder, targetFolder);
}

function copyCatalog(source, target) {
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
          copyFiles(files, source, target);
        });
      } else {
        copyFiles(files, source, target);
      }
    });
  });
}

function copyFiles(files, source, target) {
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    fs.stat(sourcePath, (err, stats) => {
      if (err) {
        logger.error('Error stating file:', err);
        return;
      }

      if (stats.isDirectory()) {
        copyCatalog(sourcePath, targetPath);
      } else {
        fs.exists(targetPath, (exists) => {
          if (exists) {
            logger.warn(`File [${file}] exists!`);
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

// от жеж ці прибічники все ускладнювати :)
// функція, яка повертає об'єкт в якому потрібний метод іще раз загорнутий в функцію, і це просто для
// того щоб експортнути...

// function fileSync() {
//   return {
//     start: () => start(),
//   };
// }
// module.exports = fileSync();

//! достатньо всього лише зробити отак:
module.exports = {
  start
}
