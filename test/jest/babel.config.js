const { babelOptions } = require('@folio/stripes-cli');

module.exports = {
  ...babelOptions,
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { 'runtime': 'automatic' }],
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      { legacy: true },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
};
