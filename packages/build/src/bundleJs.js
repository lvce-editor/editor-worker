import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'
import { rollup } from 'rollup'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
  const input = await rollup(options)
  // @ts-ignore
  await input.write(options.output)
}
