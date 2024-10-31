import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const editorWorkerPath = join(root, 'dist', 'dist', 'editorWorkerMain.js')

const sharedProcessPath = join(nodeModulesPath, '@lvce-editor', 'shared-process')

const file = join(sharedProcessPath, 'src', 'parts', 'AddCustomPathsToIndexHtml', 'AddCustomPathsToIndexHtml.js')

const content = await readFile(file, 'utf8')

const newContent = content.replaceAll(
  'const config = Object.create(null)',
  `const config = Object.create(null)
    config['develop.editorWorkerPath'] = '${editorWorkerPath}'
`
)

await writeFile(file, newContent)
