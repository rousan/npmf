#!/usr/bin/env node
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('babel-core/register');
require('babel-polyfill');
var program = require('commander');
var chalk = require('chalk');

var _require = require('./helpers'),
    print = _require.print,
    printErr = _require.printErr,
    fetchPkgMeta = _require.fetchPkgMeta,
    wrapWords = _require.wrapWords,
    extractRepoUrl = _require.extractRepoUrl,
    genNpmUrl = _require.genNpmUrl,
    extractAuthorInfo = _require.extractAuthorInfo;

var pkg = require('../package.json');

program.version(pkg.version, '-v, --version').usage('[options] [package]').parse(process.argv);

var pkgName = (process.argv[2] || '').trim();

var run = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var pkgMeta, pkgDesc, version, author, license, homepage, repoUrl, npmUrl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(pkgName.length <= 0)) {
              _context.next = 2;
              break;
            }

            throw new Error('no package provided to fetch');

          case 2:
            _context.next = 4;
            return fetchPkgMeta(pkgName);

          case 4:
            pkgMeta = _context.sent;


            print('\n');
            pkgDesc = pkgMeta.description ? chalk.grey(pkgMeta.description) : chalk.italic.grey('No description');

            print(wrapWords(pkgDesc, '   '));
            print('\n\n');

            version = pkgMeta.version || 'latest';

            print(`   version: ${chalk.grey(version)}`);
            print('\n');

            author = extractAuthorInfo(pkgMeta);

            print(`   author: ${chalk.grey(author)}`);
            print('\n');

            license = pkgMeta.license || '-';

            print(`   license: ${chalk.grey(license)}`);
            print('\n');

            print('\n');

            homepage = pkgMeta.homepage || '-';

            print(`   homepage: ${chalk.grey(homepage)}`);
            print('\n');

            repoUrl = extractRepoUrl(pkgMeta);

            print(`   repo: ${chalk.grey(repoUrl)}`);
            print('\n');

            npmUrl = genNpmUrl(pkgName);

            print(`   npm: ${chalk.grey(npmUrl)}`);
            print('\n');

            print('\n');

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function run() {
    return _ref.apply(this, arguments);
  };
}();

run().catch(function (err) {
  printErr(err);
});