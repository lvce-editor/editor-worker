import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const editorWorkerPath = join(root, 'dist', 'dist', 'editorWorkerMain.js')

const sharedProcessPath = join(nodeModulesPath, '@lvce-editor', 'shared-process')

const file = join(sharedProcessPath, 'src', 'parts', 'AddCustomPathsToIndexHtml', 'AddCustomPathsToIndexHtml.js')

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

await writeFile(file, newContent)
