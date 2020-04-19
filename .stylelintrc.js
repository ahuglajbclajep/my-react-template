// `.eslintrc.json` allows comments, but `.stylelintrc.json` does not
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order",
    "stylelint-config-prettier",
  ],
  // ignoreFiles: ["**/*.[tj]s{,x}"], // for function-name-case
};
