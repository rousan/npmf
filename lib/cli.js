#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package.json');

program.version(pkg.version, '-v, --version').usage('[options] [path ...]').parse(process.argv);