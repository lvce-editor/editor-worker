import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import pluginTypeScript from '@babel/preset-typescript'
import { join } from 'path'
import { rollup } from 'rollup'

const root = join(__dirname, '..', '..', '..')

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: join(root, 'packages/editor-worker/src/editorWorkerMain.ts'),
  preserveEntrySignatures: 'strict',
  treeshake: {
    propertyReadSideEffects: false,
  },
  output: {
    file: join(root, 'dist/dist/editorWorkerMain.js'),
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
  ],
}

export const bundleJs = async () => {
  await rollup(options)
}
