const config = require('config');
const process = require('process');
const fs = require('fs');
const path = require('path');
const { bgBlue, bgYellow, bgRed } = require('colors/safe');

const colorsEnabled = config.colorsEnabled === '1';
const logLevel = config.logLevel;

// 1. тут ми один раз за виконання програми (при першій ініціалізації логгера)
// перевіримо чи є папка logs і створимо якщо немає. Плюс, нам треба дочекатись поки цей процес закінчиться,
// бо далі по коду нам потрібні ці файлстріми і папка з логами - тому варіант з колбеком не пройде, потрібен звичайний сінхронний флоу

const logFolder = path.join('.', 'logs');

try {
  fs.accessSync(logFolder, fs.constants.F_OK);
  // якщо помилки не було, значить папка log є, і доступна на запис
} catch (err) {
  // якщо ми тут, значить папки logs немає
  fs.mkdirSync(logFolder, { recursive: true });
  console.warn(`Folder [${logFolder}] created!`);
}

// 2. тут один раз ми відкриємо файл стріми для логів, і причепимось до івенту
// beforeExit щоб закрити їх
//? { flags: 'a' } потрібен щоб дописувати контент якщо файл вже існує і в ньому вже щось є. Без цього,
// щоразу як ти запускаєш програму логи будуть перезатиратись. Це не зовсім коректна поведінка, нам потрібно зберігати історичні логи
const writeInfoStream = fs.createWriteStream(path.join(logFolder, 'info.log'), {
  flags: 'a',
});
const writeErrorStream = fs.createWriteStream(
  path.join(logFolder, 'error.log'),
  { flags: 'a' }
);

//! --------------- дороби отут будь ласка закриття стрімов по івенту beforeExit -----------------
process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
  writeInfoStream.end(() => {
    console.log('Write info stream closed successfully.');
  });
  writeErrorStream.end(() => {
    console.log('Write error stream closed successfully.');
  });
});

function getLogger(moduleName) {
  return {
    info: (...args) => {
      writeToFileLog(writeInfoStream, ...args);

      if (logLevel !== 'info') {
        return;
      }

      console.log(
        colorsEnabled ? bgBlue(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    warn: (...args) => {
      console.log('warn log');
      writeToFileLog(writeErrorStream, ...args);

      if (logLevel === 'error') {
        return;
      }

      console.error(
        colorsEnabled ? bgYellow(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
    error: (...args) => {
      writeToFileLog(writeErrorStream, ...args);

      console.error(
        colorsEnabled ? bgRed(`${moduleName}:`) : `${moduleName}:`,
        ...args
      );
    },
  };
}

function writeToFileLog(logStream, content) {
  const date = new Date().toISOString();

  logStream.write(`${date}: ${content}\n`);
}

module.exports = getLogger;
