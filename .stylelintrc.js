// `.eslintrc.json` allows comments, but `.stylelintrc.json` does not
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order",
    "stylelint-config-prettier",
  ],
  rules: {
    // see https://github.com/stylelint/stylelint/issues/5185
    "function-name-case": ["lower", { ignoreFunctions: [] }],
    "value-keyword-case": ["lower", { ignoreKeywords: [] }],
  },
};
