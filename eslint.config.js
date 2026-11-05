import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { builtinRules } from 'eslint/use-at-your-own-risk';
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

// ---------------------------------------------------------------------------------------------
// Single-source enforcement (.claude/rules/*). `no-restricted-syntax` and `react/forbid-elements`
// replace per block instead of merging, and ESLint selectors cannot see the filename, so the
// scoped rules are resolved per file here: every app/e2e source file gets the rules whose scope
// matches it, grouped into one block per distinct rule set. A new file is picked up the next
// time the config loads. Tests are exempt throughout.
// ---------------------------------------------------------------------------------------------
const PATH_ROOTS = 'collections|products|pages|journal|cart|drops|athletes';
const PALETTE = 'court|carbon|graphite|zinc|ember';
const isTest = (f) => /\.(test|fixtures)\.(ts|tsx)$/.test(f);
const inApp = (f) => f.startsWith('app/');
const notIn =
  (...excluded) =>
  (f) =>
    !excluded.includes(f);
const everywhere = () => true;

// Selector rules: [scope, selector, message, severity]
const SYNTAX_RULES = [
  [
    everywhere,
    "CallExpression[callee.property.name='graphql'][arguments.length<2]",
    'Pass { cache: Cache.long()/short() } (graphql-fragments.md).',
  ],
  [
    everywhere,
    "CallExpression[callee.property.name='graphql'] > ObjectExpression:nth-child(2):not(:has(> Property > Identifier.key[name='cache']))",
    'Pass { cache: Cache.long()/short() } (graphql-fragments.md).',
  ],
  [
    everywhere,
    String.raw`CallExpression[callee.property.name='graphql'] Property[key.name='variables'] Property[key.name=/^(country|language)$/]`,
    'country/language are injected from MARKET (lib/i18n.ts) — leave them out of variables.',
  ],
  [
    (f) =>
      f.startsWith('app/components/') ||
      f.startsWith('app/content/') ||
      f === 'app/entry.client.tsx' ||
      /^app\/lib\/.*\.client\.ts$/.test(f),
    String.raw`Identifier[name=/^PRIVATE_/]`,
    'Server-only secret (common-pitfalls.md).',
  ],
  [
    (f) => f.startsWith('app/routes/'),
    "MemberExpression[object.name='request'][property.name='url']",
    'Use the `url` arg — request.url carries .data on data requests (common-pitfalls.md).',
  ],
  [
    everywhere,
    String.raw`MemberExpression[object.object.type='MetaProperty'][object.property.name='env'][property.name=/^VITE_/]`,
    'Runtime config is PUBLIC_* via context.env (common-pitfalls.md).',
  ],
  [
    (f) =>
      inApp(f) &&
      notIn('app/lib/urls.ts', 'app/lib/storefront.ts', 'app/lib/sitemap.ts', 'app/routes.ts')(f),
    String.raw`Literal[value=/^\/(${PATH_ROOTS})(\/|\?|$)/]`,
    'Build paths with lib/urls.ts.',
  ],
  [
    (f) =>
      inApp(f) &&
      notIn('app/lib/urls.ts', 'app/lib/storefront.ts', 'app/lib/sitemap.ts', 'app/routes.ts')(f),
    String.raw`TemplateElement[value.raw=/^\/(${PATH_ROOTS})\//]`,
    'Build paths with lib/urls.ts.',
  ],
  [
    (f) => inApp(f) && notIn('app/lib/shopifyFiles.ts', 'app/lib/csp.ts', 'app/root.tsx')(f),
    String.raw`Literal[value=/cdn\.shopify\.com/]`,
    'Build Files URLs with lib/shopifyFiles.',
  ],
  [
    (f) => inApp(f) && notIn('app/lib/shopifyFiles.ts', 'app/lib/csp.ts', 'app/root.tsx')(f),
    String.raw`TemplateElement[value.raw=/cdn\.shopify\.com/]`,
    'Build Files URLs with lib/shopifyFiles.',
  ],
  [
    (f) => inApp(f) && f !== 'app/lib/urls.ts',
    String.raw`Literal[value=/(youtube|instagram)\.com/]`,
    'Use the builders in lib/urls.',
  ],
  [
    (f) =>
      (f.startsWith('app/components/') || f.startsWith('app/routes/')) &&
      f !== 'app/lib/product/store.ts',
    "MemberExpression[property.name='selectedOrFirstAvailableVariant']",
    'Read the PDP variant through resolveSelectedVariant (common-pitfalls.md).',
  ],
  [
    (f) => f.startsWith('app/components/') || f.startsWith('app/routes/'),
    "MemberExpression[object.name='window'][property.name='Shopify']",
    'Reach window.Shopify through the lib/shopifyRuntime.ts selectors.',
  ],
  [
    (f) => inApp(f) && f.endsWith('.tsx'),
    "CallExpression[callee.property.name='capture'] > Literal:first-child",
    'PostHog event names come from ANALYTICS_EVENT (lib/analytics/posthog.events.ts).',
  ],
  [
    (f) =>
      (f.startsWith('app/routes/') || f === 'app/root.tsx' || f.startsWith('app/lib/')) &&
      f !== 'app/lib/http.ts',
    "ThrowStatement > NewExpression[callee.name='Response']",
    'Throw notFound()/unavailable() from ~/lib/http.',
  ],
  [
    (f) => f.startsWith('app/routes/'),
    "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name='meta'] ArrowFunctionExpression > ArrayExpression",
    'Return buildMeta(...) (lib/seo.ts).',
  ],
  [
    everywhere,
    String.raw`VariableDeclarator[id.name=/^(fetch|load)[A-Z]/]`,
    'Single-record helpers are getX / getXOrThrow (naming-conventions.md).',
  ],
  [
    everywhere,
    String.raw`VariableDeclarator[init.callee.name='gql'][id.name!=/^[A-Z0-9]+(_[A-Z0-9]+)*_(QUERY|MUTATION|FRAGMENT)$/]`,
    'gql() documents are SCREAMING_SNAKE_CASE ending _QUERY/_MUTATION/_FRAGMENT (naming-conventions.md).',
  ],
  [
    (f) => !f.startsWith('app/components/ui/'),
    "TSQualifiedName[left.name='React']",
    "Import the type from 'react'.",
  ],
  [
    everywhere,
    String.raw`Literal[value=/(^|[\s:!'"\[])(?:[a-z]+-)*(?:bg|text|border|from|to|via|ring|fill|stroke|outline|divide|decoration|placeholder|shadow|accent|caret)-(?:${PALETTE})(?:\/\d+)?(?![a-z-])/]`,
    'Raw palette utility. Use a role token; if the specific colour is the point, disable this line with a reason — that comment is the justification CLAUDE.md requires.',
  ],
  [
    everywhere,
    String.raw`TemplateElement[value.raw=/(^|[\s:!'"\[])(?:[a-z]+-)*(?:bg|text|border|from|to|via|ring|fill|stroke|outline|divide|decoration|placeholder|shadow|accent|caret)-(?:${PALETTE})(?:\/\d+)?(?![a-z-])/]`,
    'Raw palette utility. Use a role token; if the specific colour is the point, disable this line with a reason.',
  ],
  [
    // TODO(PR 12.1): the PDP route keeps arbitrary breakpoints until its chains are re-verified.
    (f) => f !== 'app/routes/products.$handle.tsx',
    String.raw`Literal[value=/\b(?:min|max)-\[\d+(?:\.\d+)?(?:px|rem)\]:/]`,
    'Arbitrary breakpoint. Use impulse:/impulse-lg: or add a --breakpoint-* token.',
  ],
  [
    everywhere,
    String.raw`Literal[value=/\[#[0-9a-fA-F]{3,8}\]/]`,
    'Hex colour in a class. Add a token.',
  ],
  [
    everywhere,
    String.raw`Literal[value=/\b(?:bg|text|border|ring|from|to|via)-(?:red|gray|neutral|slate|stone|blue|green|orange|amber|yellow)-\d{2,3}\b/]`,
    'Tailwind default palette. Use a brand role token.',
  ],
  [
    everywhere,
    "JSXAttribute[name.name='sizes'] > Literal",
    'Prefer an IMAGE_SIZES preset (lib/imageSizes.ts); one-offs belong there too.',
  ],
];
// Core rules report at one severity per config entry, so the warn-level selector runs through a
// second instance of the same rule exposed by a local plugin.
const WARN_SELECTORS = [SYNTAX_RULES.pop()];
const LOCAL_PLUGIN = {
  rules: { 'restricted-syntax-warn': builtinRules.get('no-restricted-syntax') },
};

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
// Element rules: [scope, element, message]
const ELEMENT_RULES = [
  [
    (f) => f !== 'app/components/common/Image.tsx',
    'img',
    'Use common/Image (sizes presets, srcset).',
  ],
  ...HEADINGS.map((h) => [
    (f) => f !== 'app/components/common/Heading.tsx',
    h,
    'Render through common/Heading.',
  ]),
  [
    (f) =>
      !(
        f.startsWith('app/components/ui/') ||
        [
          'app/components/common/LazyVideo.tsx',
          'app/components/common/ContentMedia.tsx',
          'app/components/common/MediaSlot.tsx',
          'app/components/home/Hero.tsx',
          'app/components/content/athlete-signing/FounderVideo.tsx',
        ].includes(f)
      ),
    'video',
    'Use LazyVideo / ContentMedia.',
  ],
];

const listSources = (dir) =>
  fs
    .readdirSync(path.join(__dirname, dir), { recursive: true })
    .map((f) => `${dir}/${String(f).split(path.sep).join('/')}`)
    .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('.d.ts') && !isTest(f));

const buildEnforcement = () => {
  const groups = new Map();
  for (const file of [...listSources('app'), ...listSources('e2e')]) {
    const syntax = SYNTAX_RULES.filter(([scope]) => scope(file));
    const elements = ELEMENT_RULES.filter(([scope]) => scope(file));
    const key = JSON.stringify([syntax.map((r) => r[1]), elements.map((r) => r[1])]);
    if (!groups.has(key)) groups.set(key, { syntax, elements, files: [] });
    groups.get(key).files.push(file);
  }
  return [...groups.values()].map(({ syntax, elements, files }) => ({
    files,
    plugins: { local: LOCAL_PLUGIN },
    rules: {
      'no-restricted-syntax': [
        'error',
        ...syntax.map(([, selector, message]) => ({ selector, message })),
      ],
      'local/restricted-syntax-warn': [
        'warn',
        ...WARN_SELECTORS.map(([, selector, message]) => ({ selector, message })),
      ],
      'react/forbid-elements': [
        'error',
        { forbid: elements.map(([, element, message]) => ({ element, message })) },
      ],
    },
  }));
};

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
  // Single-source enforcement: per-file selector and element rules (see buildEnforcement).
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { local: LOCAL_PLUGIN },
    rules: { 'eslint-comments/require-description': ['error', { ignore: [] }] },
  },
  ...buildEnforcement(),
  {
    // Tailwind only (module-boundaries.md). The two documented data-driven exceptions are off below.
    files: ['app/**/*.tsx'],
    ignores: [
      'app/**/*.test.tsx',
      'app/components/common/Image.tsx',
      'app/components/product/ColorSwatches.tsx',
    ],
    rules: {
      'react/forbid-dom-props': [
        'error',
        { forbid: [{ propName: 'style', message: 'Tailwind only (module-boundaries.md).' }] },
      ],
      'react/forbid-component-props': [
        'error',
        { forbid: [{ propName: 'style', message: 'Tailwind only (module-boundaries.md).' }] },
      ],
    },
  },
];
