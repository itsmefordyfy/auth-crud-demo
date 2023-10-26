module.exports = {
  extends: 'next',
  settings: {
    next: {
      rootDir: 'apps/next/',
    },
  },
  rules: {
    "quotes": ["error", "double"],
    "semi": ["error", "always"]
  },
  root: true,
};
