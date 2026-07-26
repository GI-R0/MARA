module.exports = {
  env: { node: true, es2021: true },
  extends: ['eslint:recommended'],
  plugins: [],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  rules: {
    'no-unused-vars': ['warn', { vars: 'all', args: 'none' }]
  }
};
