#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version')
  .usage('[options] [path ...]')
  .parse(process.argv);
