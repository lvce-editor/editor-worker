import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'path'
import { rollup, type RollupOptions } from 'rollup'
import { root } from './root.ts'

const bundles = [
  {
    input: join(root, 'packages/editor-worker/src/editorWorkerMain.ts'),
    output: join(root, '.tmp/dist/dist/editorWorkerMain.js'),
  },
  {
    input: join(root, 'packages/evaluation-worker/src/evaluationWorkerMain.ts'),
    output: join(root, '.tmp/dist/dist/evaluationWorkerMain.js'),
  },
]

const getOptions = (input: string, outputFile: string): RollupOptions => ({
  input,
  preserveEntrySignatures: 'strict',
  treeshake: {
    propertyReadSideEffects: false,
  },
  output: {
    file: outputFile,
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  },
  external: ['electron', 'ws'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
  ],
})

export const bundleJs = async (): Promise<void> => {
  for (const bundle of bundles) {
    const options = getOptions(bundle.input, bundle.output)
    const input = await rollup(options)
    const output = Array.isArray(options.output) ? options.output[0] : options.output
    await input.write(output!)
  }
}
