module.exports = {
  parser: 'babel-eslint',
  extends: [
    '@strv/javascript/environments/react/v16',
    '@strv/javascript/environments/react/optional',
    '@strv/javascript/coding-styles/recommended',
    'prettier',
    'prettier/react',
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {},
}
