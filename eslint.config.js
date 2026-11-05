import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintComments from 'eslint-plugin-eslint-comments';
import _import from 'eslint-plugin-import';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// Import seams (.claude/rules). Flat config replaces a rule per block rather than merging it,
// so each scoped block below spreads the layers beneath it.
const GLOBAL_PATHS = [
  {
    name: 'posthog-node',
    message:
      "Import from 'posthog-node/edge' — the default entry needs Node built-ins (common-pitfalls.md).",
  },
  { name: 'motion', message: "Import from 'motion/react' (LazyMotion + m)." },
];
const MONEY_PATH = {
  name: '@shopify/hydrogen',
  importNames: ['formatMoney'],
  message: 'Format money through lib/money.ts → common/Price.',
};
const STORE_PATH = {
  name: '@shopify/hydrogen/react',
  importNames: ['createCartComponents', 'createProductComponents', 'useCartAnalytics'],
  message: 'One store: ~/lib/cart, ~/lib/product/store, analytics/Trackers.',
};
const COMPONENT_PATHS = [
  {
    name: '@shopify/hydrogen',
    importNames: ['gql', 'Cache', 'formatMoney'],
    message:
      'GraphQL lives in loaders/lib (module-boundaries.md); money goes through common/Price.',
  },
  {
    name: 'lucide-react',
    importNames: [
      'Menu',
      'MenuIcon',
      'User',
      'UserIcon',
      'ShoppingBag',
      'ShoppingBagIcon',
      'ShoppingCart',
      'X',
      'XIcon',
    ],
    message: 'Use the traced glyphs in common/icons.tsx (ui-components.md).',
  },
];
const COMPONENT_PATTERNS = [
  {
    group: ['~/lib/fragments', '~/lib/product/queries', '~/lib/sitemap'],
    allowTypeImports: true,
    message: 'Import the *Data type only.',
  },
  {
    group: [
      '~/lib/*.server',
      '~/lib/storefront',
      '~/lib/oxygen',
      '~/lib/shopifyMiddleware',
      '~/lib/csp',
    ],
    message: 'Server-only (module-boundaries.md).',
  },
  {
    group: ['~/lib/shopifyFiles'],
    allowTypeImports: true,
    message: 'Files assets are content — reference them from app/content/*.',
  },
  {
    group: ['~/components/ui/button'],
    message: 'Brand CTAs render through common/Cta (ui-components.md).',
  },
];
const restrict = (paths, patterns = []) => ['error', { paths, patterns }];

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/.superpowers/',
      '**/build/',
      '**/dist/',
      '**/*.generated.d.ts',
      // Written at the project root by @shopify/hydrogen/ts-plugin (gitignored).
      '**/*-graphql-env.d.ts',
      '**/.react-router/',
      // Playwright run artifacts (gitignored) — the trace viewer ships minified .js.
      '**/test-results/',
      '**/playwright-report/',
      // Local agent worktrees (gitignored) — each carries a full copy of the repo.
      '**/.claude/worktrees/',
    ],
  },
  ...fixupConfigRules(compat.extends('eslint:recommended', 'plugin:eslint-comments/recommended')),
  {
    plugins: {
      'eslint-comments': fixupPluginRules(eslintComments),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'eslint-comments/no-unused-disable': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-use-before-define': 'off',
      'no-warning-comments': 'off',
      'object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
        },
      ],
      'no-useless-escape': 'off',
      'no-case-declarations': 'off',
    },
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended'
    )
  ).map((config) => ({
    ...config,
    files: ['**/*.{js,jsx,ts,tsx}'],
  })),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        {
          name: 'Link',
          linkAttribute: 'to',
        },
        {
          name: 'NavLink',
          linkAttribute: 'to',
        },
      ],
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/label-has-for': 'off',
      'react/display-name': 'off',
      'react/no-array-index-key': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      // Stale-closure bugs are nasty — missing hook deps are an error. Must sit after the
      // react-hooks/recommended extends above, which re-apply the plugin's `warn`.
      'react-hooks/exhaustive-deps': 'error',
      // House rule (.claude/rules/naming-conventions.md): components are `const` arrow functions, never the `function` keyword.
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
    },
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript'
    )
  ).map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolvers': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: __dirname,
        },
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        {
          selector: 'property',
          format: null,
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      // `any` defeats the type system — an error, not a warning (the ui/ override below stays off).
      '@typescript-eslint/no-explicit-any': 'error',
      // `Array<T>` over `T[]` (.claude/rules/naming-conventions.md).
      '@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
      // Enforce `import type {...}` for type-only imports (pairs with verbatimModuleSyntax).
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      // Prefer `type` over `interface` (.claude/rules/naming-conventions.md).
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': restrict([
        ...GLOBAL_PATHS,
        MONEY_PATH,
        STORE_PATH,
      ]),
    },
  },
  {
    // The single seams that own the thing the rule above sends everyone else to.
    files: ['app/lib/money.ts'],
    rules: { '@typescript-eslint/no-restricted-imports': restrict([...GLOBAL_PATHS, STORE_PATH]) },
  },
  {
    files: ['app/lib/cart.ts', 'app/lib/product/store.ts', 'app/components/analytics/Trackers.tsx'],
    rules: { '@typescript-eslint/no-restricted-imports': restrict([...GLOBAL_PATHS, MONEY_PATH]) },
  },
  {
    files: ['app/components/**/*.{ts,tsx}'],
    ignores: ['app/components/ui/**', 'app/components/analytics/Trackers.tsx'],
    rules: {
      '@typescript-eslint/no-restricted-imports': restrict(
        [...GLOBAL_PATHS, STORE_PATH, ...COMPONENT_PATHS],
        COMPONENT_PATTERNS
      ),
    },
  },
  {
    // Brand CTA anatomy composes buttonVariants directly (ui-components.md).
    files: [
      'app/components/common/Cta.tsx',
      'app/components/product/AddToCartBar.tsx',
      'app/components/collection/LoadMore.tsx',
      'app/components/cart/CartSummary.tsx',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': restrict(
        [...GLOBAL_PATHS, STORE_PATH, ...COMPONENT_PATHS],
        COMPONENT_PATTERNS.filter((p) => !p.group.includes('~/components/ui/button'))
      ),
    },
  },
  {
    // common/Image is the one image seam: it needs isShopifyCdnUrl to pick fluid vs fixed mode.
    files: ['app/components/common/Image.tsx'],
    rules: {
      '@typescript-eslint/no-restricted-imports': restrict(
        [...GLOBAL_PATHS, STORE_PATH, ...COMPONENT_PATHS],
        COMPONENT_PATTERNS.filter((p) => !p.group.includes('~/lib/shopifyFiles'))
      ),
    },
  },
  {
    // Generated shadcn/ui source — only the global package seams apply.
    files: ['app/components/ui/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': restrict([
        ...GLOBAL_PATHS,
        MONEY_PATH,
        STORE_PATH,
      ]),
    },
  },
  {
    // Generated shadcn/ui source — exempt, see .claude/rules/ui-components.md
    files: ['app/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react/function-component-definition': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
