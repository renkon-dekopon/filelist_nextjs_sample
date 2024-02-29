const path = require('path');

const buildEslintCommand = (filenames) =>
  `yarn lint:fix -- --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;

const buildPrettierCommand = (filenames) =>
  `yarn format:write -- ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildPrettierCommand],
};
