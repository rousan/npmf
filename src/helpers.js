const axios = require('axios');
const chalk = require('chalk');
const HttpStatus = require('http-status-codes');
const wordWrap = require('word-wrap');

const currentOutStream = process.stdout;

const print = msg => currentOutStream.write(String(msg));

const printErr = (err) => {
  const errMsg = err.message ? err.message : String(err);
  print('\n');
  print(`   ${chalk.red('error')}: ${chalk.grey(errMsg)}`);
  print('\n\n');
};

const genApiEndpoint = pkgName => `https://registry.npmjs.org/${encodeURIComponent(pkgName)}/latest`;

const fetchPkgMeta = async (pkgName) => {
  const apiUrl = genApiEndpoint(pkgName);
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (err) {
    if (err.response) {
      const { status } = err.response;
      if (status === HttpStatus.NOT_FOUND) {
        throw new Error('package not found in registry');
      } else {
        throw new Error(`${HttpStatus.getStatusText(status).toLowerCase()} ${status}`);
      }
    } else {
      throw new Error('something went wrong');
    }
  }
};

const wrapWords = (text, indent) => wordWrap(
  text,
  {
    indent,
    trim: false,
    width: currentOutStream.columns - indent.length,
  },
);

const extractRepoUrl = (pkgMeta) => {
  const { repository } = pkgMeta;

  if (!repository) {
    return '-';
  }

  if (typeof repository !== 'object') {
    return String(repository).trim();
  }

  return repository.url.replace(new RegExp(`^${repository.type}\\+`), '');
};

const genNpmUrl = pkgName => `https://www.npmjs.com/package/${encodeURIComponent(pkgName)}`;

const extractAuthorInfo = (pkgMeta) => {
  const { author } = pkgMeta;

  if (!author) {
    return '-';
  }

  if (typeof author !== 'object') {
    return String(author).trim();
  }

  const contactInfo = author.email || author.url || '';
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
  extractAuthorInfo,
};
