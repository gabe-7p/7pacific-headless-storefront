// Runs on staged files at commit time (via .husky/pre-commit).
// Mirrors brooklyn: full type-check, then eslint + prettier on the staged files.
module.exports = {
  // Type-check the whole project if any TS file changed (tsc has no per-file mode).
  '**/*.ts?(x)': () => 'pnpm type-check',
  // Lint (and auto-fix) only the staged JS/TS files.
  '**/*.{ts,tsx,js,jsx,cjs,mjs}': (filenames) =>
    `eslint --no-error-on-unmatched-pattern --fix ${filenames.map((f) => `"${f}"`).join(' ')}`,
  // Format the staged files.
  '**/*.{ts,tsx,js,jsx,cjs,mjs,json,yml,yaml,css,md}': (filenames) =>
    `prettier --write ${filenames.map((f) => `"${f}"`).join(' ')}`,
};
