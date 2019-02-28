'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var axios = require('axios');
var chalk = require('chalk');
var HttpStatus = require('http-status-codes');
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

var genApiEndpoint = function genApiEndpoint(pkgName) {
  return `https://registry.npmjs.org/${encodeURIComponent(pkgName)}/latest`;
};

var fetchPkgMeta = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pkgName) {
    var apiUrl, response, status;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            apiUrl = genApiEndpoint(pkgName);
            _context.prev = 1;
            _context.next = 4;
            return axios.get(apiUrl);

          case 4:
            response = _context.sent;
            return _context.abrupt('return', response.data);

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](1);

            if (!_context.t0.response) {
              _context.next = 19;
              break;
            }

            status = _context.t0.response.status;

            if (!(status === HttpStatus.NOT_FOUND)) {
              _context.next = 16;
              break;
            }

            throw new Error('package not found in registry');

          case 16:
            throw new Error(`${HttpStatus.getStatusText(status).toLowerCase()} ${status}`);

          case 17:
            _context.next = 20;
            break;

          case 19:
            throw new Error('something went wrong');

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 8]]);
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