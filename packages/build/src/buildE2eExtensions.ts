import { build } from 'esbuild'
import { join } from 'node:path'
import { root } from './root.ts'

const extensionNames = [
  'editor.alt-hover-definition-link',
  'editor.completion-click',
  'editor.completion-close-on-type-space',
  'editor.completion-empty',
  'editor.completion-one-result',
  'editor.completion-open-on-type',
  'editor.completion-scroll',
  'editor.gutter-decoration-provider',
  'editor.hover-show',
  'editor.rename-provider',
  'editor.source-actions-execute',
  'editor.source-actions-open',
  'sample.diagnostic-provider',
  'sample.diagnostic-provider-empty',
  'sample.diagnostic-provider-error',
  'sample.diagnostic-provider-pending',
  'sample.diagnostic-provider-update-on-type',
  'write-file-error',
] as const

const buildE2eExtension = async (extensionName: string): Promise<void> => {
  const extensionPath = join(root, 'packages', 'e2e', 'fixtures', extensionName)
  await build({
    bundle: true,
    entryPoints: [join(extensionPath, 'main.js')],
    external: ['electron', 'node:*'],
    format: 'esm',
    outfile: join(extensionPath, 'dist', 'main.js'),
    platform: 'browser',
    target: 'esnext',
  })
}

export const buildE2eExtensions = async (): Promise<void> => {
  await Promise.all(extensionNames.map(buildE2eExtension))
}
