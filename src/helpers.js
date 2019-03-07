const util = require('util');
const exec = util.promisify(require('child_process').exec);

const chalk = require('chalk');
const wordWrap = require('word-wrap');

const currentOutStream = process.stdout;

const print = msg => currentOutStream.write(String(msg));

const printErr = (err) => {
  const errMsg = err.message ? err.message : String(err);
  print('\n');
  print(`   ${chalk.red('error')}: ${chalk.grey(errMsg)}`);
  print('\n\n');
};

const fetchPkgMeta = async (pkgName) => {
  const { stdout, stderr } = await exec(`npm info ${pkgName} --json description version author license homepage repository npm`);

  if (stderr) {
    throw new Error(stderr);
  }
  return JSON.parse(stdout);
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
