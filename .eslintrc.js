const dev = process.env.NODE_ENV === "development" ? "warn" : "error";

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": dev,
    "comma-dangle": ["error", "always-multiline"],
    semi: ["error", "always"],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
  },
};
