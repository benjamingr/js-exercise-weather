module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  globals: {
    Skycons: 'readonly',
  },
  rules: {
    'no-use-before-define': ['off'],
  },
};
