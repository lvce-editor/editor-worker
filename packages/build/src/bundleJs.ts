import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'path'
import { rollup, type RollupOptions } from 'rollup'
import { root } from './root.ts'

const options: RollupOptions = {
  input: join(root, 'packages/editor-worker/src/editorWorkerMain.ts'),
  preserveEntrySignatures: 'strict',
  treeshake: {
    propertyReadSideEffects: false,
  },
  output: {
    file: join(root, '.tmp/dist/dist/editorWorkerMain.js'),
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
}

export const bundleJs = async (): Promise<void> => {
  const input = await rollup(options)
  const output = Array.isArray(options.output) ? options.output[0] : options.output
  try {
    await input.write(output!)
  } finally {
    await input.close()
  }
  const sdk = await rollup({
    ...options,
    external: [...(options.external as string[]), '@lvce-editor/rpc-registry'],
    input: join(root, 'packages/editor-worker/src/diffSdk.ts'),
  })
  try {
    await sdk.write({ ...output, file: join(root, '.tmp/dist/dist/diff-sdk.js') })
  } finally {
    await sdk.close()
  }
}
