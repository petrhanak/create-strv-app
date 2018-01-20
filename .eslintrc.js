module.exports = {
  extends: [
    '@strv/javascript/environments/nodejs/v8',
    '@strv/javascript/environments/nodejs/optional',
    '@strv/javascript/coding-styles/recommended',
    'prettier',
  ],
  env: {
    node: true,
  },
  rules: { 'no-console': 0 },
}
