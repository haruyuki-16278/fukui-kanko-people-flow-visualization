module.exports = {
  "**/*.ts?(x)": [
    () => "tsc -p tsconfig.json --noEmit",
    (filenames) => (filenames.length > 10 ? "eslint ." : `eslint ${filenames.join(" ")}`),
  ],
};
