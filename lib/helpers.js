'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require('util');
var exec = util.promisify(require('child_process').exec);

var chalk = require('chalk');
var wordWrap = require('word-wrap');

var currentOutStream = process.stdout;

var print = function print(msg) {
  return currentOutStream.write(String(msg));
};

var printErr = function printErr(err) {
  var errMsg = err.message ? err.message : String(err);
  print('\n');
  print(`   ${chalk.red('error')}: ${chalk.grey(errMsg)}`);
  print('\n\n');
};

var fetchPkgMeta = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pkgName) {
    var _ref2, stdout, stderr;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return exec(`npm info ${pkgName} --json description version author license homepage repository npm`);

          case 2:
            _ref2 = _context.sent;
            stdout = _ref2.stdout;
            stderr = _ref2.stderr;

            if (!stderr) {
              _context.next = 7;
              break;
            }

            throw new Error(stderr);

          case 7:
            return _context.abrupt('return', JSON.parse(stdout));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchPkgMeta(_x) {
    return _ref.apply(this, arguments);
  };
}();

var wrapWords = function wrapWords(text, indent) {
  return wordWrap(text, {
    indent,
    trim: false,
    width: currentOutStream.columns - indent.length
  });
};

var extractRepoUrl = function extractRepoUrl(pkgMeta) {
  var repository = pkgMeta.repository;


  if (!repository) {
    return '-';
  }

  if (typeof repository !== 'object') {
    return String(repository).trim();
  }

  return repository.url.replace(new RegExp(`^${repository.type}\\+`), '');
};

var genNpmUrl = function genNpmUrl(pkgName) {
  return `https://www.npmjs.com/package/${encodeURIComponent(pkgName)}`;
};

var extractAuthorInfo = function extractAuthorInfo(pkgMeta) {
  var author = pkgMeta.author;


  if (!author) {
    return '-';
  }

  if (typeof author !== 'object') {
    return String(author).trim();
  }

  var contactInfo = author.email || author.url || '';
  return contactInfo ? `${author.name} (${contactInfo})` : author.name;
};

module.exports = {
  print,
  printErr,
  fetchPkgMeta,
  currentOutStream,
  wrapWords,
  extractRepoUrl,
  genNpmUrl,
  extractAuthorInfo
};