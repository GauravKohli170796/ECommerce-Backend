require("@rushstack/eslint-patch/modern-module-resolution");
const rulesDirPlugin = require("eslint-plugin-rulesdir");
rulesDirPlugin.RULES_DIR = "node_modules/eslint-config-gaurav-common/lib/rules/custom-rules";

module.exports = {
  extends: ["eslint-config-gaurav-common/lib"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: ["./tsconfig.eslint.json"]
  }
};