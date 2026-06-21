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
        // Exclude codegen output (resolved via tsconfig baseUrl) and React Router's
        // generated per-route types (./+types/*) — both resolve in tsc/build, not here.
        pathNot: ['\\.generated$', '\\+types/'],
      },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
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
    // Treat these bare specifiers (codegen output resolved via tsconfig baseUrl) as resolvable.
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
