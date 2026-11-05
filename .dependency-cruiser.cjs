/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Runtime circular dependencies make code hard to reason about, test, and refactor. ' +
        'Type-only cycles are erased at compile time and are not flagged.',
      from: {},
      to: { circular: true, viaOnly: { dependencyTypesNot: ['type-only'] } },
    },
    {
      name: 'not-to-unresolvable',
      severity: 'error',
      comment: 'An import that cannot be resolved — a typo or a missing dependency.',
      from: {},
      to: {
        couldNotResolve: true,
        // Exclude React Router's generated per-route types (./+types/*) — they
        // resolve through tsconfig rootDirs in tsc/build, not here.
        pathNot: ['\\+types/'],
      },
    },
    {
      name: 'components-not-to-server',
      severity: 'error',
      comment: 'Components render props; server modules would ship to the browser.',
      from: { path: '^app/(components|content)/' },
      to: {
        path: [
          '\\.server\\.tsx?$',
          '^app/lib/(storefront|oxygen|shopifyMiddleware|cart\\.server|csp|sitemap|robots)\\.ts$',
          'node_modules/posthog-node',
        ],
        dependencyTypesNot: ['type-only'],
      },
    },
    {
      name: 'components-no-gql-documents',
      severity: 'error',
      comment: 'Components import *Data types only — a gql() document would ship to the browser.',
      from: { path: '^app/components/' },
      to: {
        path: '^app/lib/(fragments|product/queries|sitemap)\\.ts$',
        dependencyTypesNot: ['type-only'],
      },
    },
    {
      name: 'lib-not-to-components',
      severity: 'error',
      comment: 'Lib is logic; it never renders or imports components (a type import is erased).',
      // Tests may mount components against the lib they exercise (posthog.client.test.tsx → Trackers).
      from: { path: '^app/lib/', pathNot: '\\.test\\.tsx?$' },
      to: { path: '^app/components/', dependencyTypesNot: ['type-only'] },
    },
    {
      name: 'components-not-to-routes',
      severity: 'error',
      comment: 'Components never import from routes.',
      from: { path: '^app/components/' },
      to: { path: '^app/routes/' },
    },
    {
      name: 'cart-server-only-from-root',
      severity: 'error',
      comment: 'The /api/cart handlers are wired by the root middleware only.',
      from: { pathNot: ['^app/root\\.tsx$', '^app/lib/shopifyMiddleware\\.ts$'] },
      to: { path: '^app/lib/cart\\.server\\.ts$', dependencyTypesNot: ['type-only'] },
    },
    {
      name: 'modules-public-entry-only',
      severity: 'error',
      comment: 'Import a module through its public index.ts, not its internals.',
      from: { path: '^app/', pathNot: '^app/modules/([^/]+)/' },
      to: { path: '^app/modules/([^/]+)/(components|lib|content)/' },
    },
    {
      name: 'modules-no-cross-internals',
      severity: 'error',
      comment: "A module never reaches into another module's internals.",
      from: { path: '^app/modules/([^/]+)/' },
      to: { path: '^app/modules/(?!$1)[^/]+/(components|lib|content)/' },
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment:
        'Module nobody imports. Allowed for framework entry points (routes, root, entry, server), config, styles, and type declarations.',
      from: {
        orphan: true,
        pathNot: [
          '\\.d\\.ts$',
          '(^|/)\\.[^/]+\\.(c?js|ts)$', // dotfile configs
          '\\.config\\.(c?js|ts)$',
          '^app/root\\.tsx$',
          '^app/entry\\.(client|server)\\.tsx$',
          '^app/routes\\.ts$',
          '^app/routes/', // file-based routes are framework entry points
          '^app/styles/',
          '^server\\.ts$',
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    // tsconfig paths make the `~/*` alias resolvable.
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      conditionNames: ['import', 'require', 'node', 'default'],
      exportsFields: ['exports'],
    },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)' },
    },
  },
};
