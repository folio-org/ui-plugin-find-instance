// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const config = require('@folio/jest-config-stripes');

module.exports = {
  ...config,
  collectCoverageFrom: [
    '**/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/jest/**',
  ],
  testMatch: ['**/**/?(*.)test.{js,jsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/test/bigtest/'],
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setup-tests.js'),
  ],
  setupFilesAfterEnv: [path.join(__dirname, './test/jest/jest.setup.js')],
};
