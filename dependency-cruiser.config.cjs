/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-feature-imports',
      comment: 'features/[name] may not import from features/[other-name]',
      severity: 'warn',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/',
        pathNot: '^src/features/$1/',
      },
    },
    {
      name: 'no-generated-outside-external-resources',
      comment:
        'Generated API types may only be imported from externalResources/',
      severity: 'error',
      from: { pathNot: '^src/features/[^/]+/externalResources' },
      to: { path: '^src/shared/api/generated' },
    },
    {
      name: 'no-shared-importing-features',
      comment: 'Shared layer must not import from features',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/features/' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies lead to tight coupling and maintenance pain',
      from: {},
      to: { circular: true },
    },
    {
      name: 'not-to-spec',
      comment: 'Production code must not import test files',
      severity: 'error',
      from: {
        pathNot: '[.](?:spec|test)[.](?:ts|tsx)$',
      },
      to: {
        path: '[.](?:spec|test)[.](?:ts|tsx)$',
      },
    },
    {
      name: 'not-to-dev-dep',
      comment: 'Source code should not depend on devDependencies',
      severity: 'error',
      from: {
        path: '^src/',
        pathNot: [
          '[.](?:spec|test)[.](?:ts|tsx)$',
          '^src/vite-env[.]d[.]ts$',
          '^src/test-setup[.]ts$',
        ],
      },
      to: {
        dependencyTypes: ['npm-dev'],
        dependencyTypesNot: ['type-only'],
        pathNot: [
          'node_modules/@types/',
          // Devtools are intentionally imported in routes/__root.tsx
          // and conditionally rendered only in DEV mode
          'node_modules/@tanstack/react-query-devtools',
          'node_modules/@tanstack/router-devtools',
        ],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: ['node_modules'],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      mainFields: ['module', 'main', 'types', 'typings'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)',
      },
    },
  },
}
