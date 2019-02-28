#!/usr/bin/env node

require('babel-core/register');
require('babel-polyfill');
const program = require('commander');
const chalk = require('chalk');
const {
  print, printErr, fetchPkgMeta, wrapWords, extractRepoUrl, genNpmUrl, extractAuthorInfo,
} = require('./helpers');
const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version')
  .usage('[options] [package]')
  .parse(process.argv);

const pkgName = (process.argv[2] || '').trim();

const run = async () => {
  if (pkgName.length <= 0) {
    throw new Error('no package provided to fetch');
  }

  const pkgMeta = await fetchPkgMeta(pkgName);

  print('\n');
  const pkgDesc = pkgMeta.description ? chalk.grey(pkgMeta.description) : chalk.italic.grey('No description');
  print(wrapWords(pkgDesc, '   '));
  print('\n\n');

  const version = pkgMeta.version || 'latest';
  print(`   version: ${chalk.grey(version)}`);
  print('\n');

  const author = extractAuthorInfo(pkgMeta);
  print(`   author: ${chalk.grey(author)}`);
  print('\n');

  const license = pkgMeta.license || '-';
  print(`   license: ${chalk.grey(license)}`);
  print('\n');

  print('\n');

  const homepage = pkgMeta.homepage || '-';
  print(`   homepage: ${chalk.grey(homepage)}`);
  print('\n');

  const repoUrl = extractRepoUrl(pkgMeta);
  print(`   repo: ${chalk.grey(repoUrl)}`);
  print('\n');

  const npmUrl = genNpmUrl(pkgName);
  print(`   npm: ${chalk.grey(npmUrl)}`);
  print('\n');

  print('\n');
};

run()
  .catch((err) => {
    printErr(err);
  });
