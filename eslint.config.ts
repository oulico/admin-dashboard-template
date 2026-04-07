import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'src/routeTree.gen.ts'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'shared', pattern: ['shared'] },
        { type: 'features', pattern: ['features'] },
        { type: 'routes', pattern: ['routes'] },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'warn',
        {
          default: 'disallow',
          rules: [
            { from: 'shared', allow: ['shared'] },
            { from: 'features', allow: ['shared', 'features'] },
            { from: 'routes', allow: ['features', 'shared'] },
          ],
        },
      ],
    },
  },
)
