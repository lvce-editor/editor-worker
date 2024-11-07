import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const editorWorkerPath = join(root, 'dist', 'dist', 'editorWorkerMain.js')

const sharedProcessPath = join(nodeModulesPath, '@lvce-editor', 'shared-process')

const addCustomPathsToIndexHtml = join(sharedProcessPath, 'src', 'parts', 'AddCustomPathsToIndexHtml', 'AddCustomPathsToIndexHtml.js')

const newContent = `import * as GetRemoteUrl from '../GetRemoteUrl/GetRemoteUrl.js';

export const addCustomPathsToIndexHtml = async (content) => {
    const config = Object.create(null)
    config['develop.editorWorkerPath'] = GetRemoteUrl.getRemoteUrl('${editorWorkerPath}')
    const stringifiedConfig = JSON.stringify(config, null, 2);
    let newContent = content
    newContent = newContent.toString().replace('</title>', \`</title>
    <script type="application.json" id="Config">\${stringifiedConfig}</script>\`);
    return newContent;
};
`

await writeFile(addCustomPathsToIndexHtml, newContent)

const serverJsPath = join(nodeModulesPath, '@lvce-editor', 'server', 'src', 'server.js')

const oldContent = await readFile(serverJsPath, 'utf8')

if (!oldContent.includes(`app.use('/', servePackages, serve404())`)) {
  const newContent2 = oldContent.replace(
    `app.use('/packages', servePackages, serve404())`,
    `app.use('/packages', servePackages, serve404())
    app.use('/', servePackages, serve404())
    `
  )
  await writeFile(serverJsPath, newContent2)
}
