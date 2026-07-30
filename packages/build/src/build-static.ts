import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

const sharedProcessUrl = import.meta.resolve('@lvce-editor/shared-process')

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/editor-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const patchFile = async (path: string, occurrence: string, replacement: string): Promise<void> => {
  const content = await readFile(path, 'utf8')
  if (content.includes(occurrence)) {
    await writeFile(path, content.replace(occurrence, replacement))
  }
}

const patchDynamicWebExtensionTokenizerUrls = async (): Promise<void> => {
  const extensionManagementWorkerPath = join(
    root,
    'dist',
    commitHash,
    'packages',
    'extension-management-worker',
    'dist',
    'extensionManagementWorkerMain.js',
  )
  const occurrence = `const getRemoteUrl = uri => {
  if (uri.startsWith('/')) {
    return \`/remote\${uri}\`;
  }
  return \`/remote/\${uri}\`;
};`
  const replacement = `const getRemoteUrl = uri => {
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  if (uri.startsWith('/')) {
    return \`/remote\${uri}\`;
  }
  return \`/remote/\${uri}\`;
};`
  await patchFile(extensionManagementWorkerPath, occurrence, replacement)
}

const patchNestedEmbeddedTokenizers = async (): Promise<void> => {
  const syntaxHighlightingWorkerPath = join(
    root,
    'dist',
    commitHash,
    'packages',
    'syntax-highlighting-worker',
    'dist',
    'syntaxHighlightingWorkerMain.js',
  )
  const occurrence = `const getTokensViewportEmbedded = (langageId, lines, lineCache, linesWithEmbed) => {
  const tokenizersToLoad = [];
  const embeddedResults = [];
  let topContext;
  for (const index of linesWithEmbed) {
    const result = lineCache[index + 1];
    const line = lines[index];
    if (result.embeddedLanguage) {
      const {
        embeddedLanguage,
        embeddedLanguageStart,
        embeddedLanguageEnd
      } = result;
      const embeddedTokenizer = getTokenizer(embeddedLanguage);
      if (embeddedLanguageStart !== line.length && embeddedTokenizer && embeddedTokenizer !== TokenizePlainText) {
        const isFull = embeddedLanguageStart === 0 && embeddedLanguageEnd === line.length;
        const partialLine = line.slice(embeddedLanguageStart, embeddedLanguageEnd);
        const embedResult = safeTokenizeLine(langageId, embeddedTokenizer.tokenizeLine, partialLine, topContext || getInitialLineState(embeddedTokenizer.initialLineState), embeddedTokenizer.hasArrayReturn);
        topContext = embedResult;
        result.embeddedResultIndex = embeddedResults.length;
        embeddedResults.push({
          result: embedResult,
          TokenMap: embeddedTokenizer.TokenMap,
          isFull
        });
      } else if (line.length === 0) {
        const embedResult = {
          tokens: []
        };
        result.embeddedResultIndex = embeddedResults.length;
        embeddedResults.push({
          result: embedResult,
          isFull: true,
          TokenMap: []
        });
      } else {
        tokenizersToLoad.push(embeddedLanguage);
        embeddedResults.push({
          result: {},
          isFull: false,
          TokenMap: []
        });
        topContext = undefined;
      }
    } else {
      topContext = undefined;
    }
  }
  return {
    tokenizersToLoad,
    embeddedResults
  };
};`
  const replacement = `const getEmbeddedTokenization = (langageId, line, embeddedLanguage, embeddedLanguageStart, embeddedLanguageEnd, topContexts, tokenizersToLoad) => {
  const embeddedTokenizer = getTokenizer(embeddedLanguage);
  if (embeddedLanguageStart !== line.length && embeddedTokenizer && embeddedTokenizer !== TokenizePlainText) {
    const isFull = embeddedLanguageStart === 0 && embeddedLanguageEnd === line.length;
    const partialLine = line.slice(embeddedLanguageStart, embeddedLanguageEnd);
    const embedResult = safeTokenizeLine(langageId, embeddedTokenizer.tokenizeLine, partialLine, topContexts[embeddedLanguage] || getInitialLineState(embeddedTokenizer.initialLineState), embeddedTokenizer.hasArrayReturn);
    topContexts[embeddedLanguage] = embedResult;
    if (embedResult.embeddedLanguage) {
      const nested = getEmbeddedTokenization(langageId, partialLine, embedResult.embeddedLanguage, embedResult.embeddedLanguageStart, embedResult.embeddedLanguageEnd, topContexts, tokenizersToLoad);
      if (nested?.isFull) {
        return nested;
      }
    }
    return {
      result: embedResult,
      TokenMap: embeddedTokenizer.TokenMap,
      isFull
    };
  }
  tokenizersToLoad.push(embeddedLanguage);
  topContexts[embeddedLanguage] = undefined;
  return {
    result: {},
    isFull: false,
    TokenMap: []
  };
};
const getTokensViewportEmbedded = (langageId, lines, lineCache, linesWithEmbed) => {
  const tokenizersToLoad = [];
  const embeddedResults = [];
  const topContexts = Object.create(null);
  for (const index of linesWithEmbed) {
    const result = lineCache[index + 1];
    const line = lines[index];
    if (result.embeddedLanguage) {
      const {
        embeddedLanguage,
        embeddedLanguageStart,
        embeddedLanguageEnd
      } = result;
      if (line.length === 0) {
        const embedResult = {
          tokens: []
        };
        result.embeddedResultIndex = embeddedResults.length;
        embeddedResults.push({
          result: embedResult,
          isFull: true,
          TokenMap: []
        });
      } else {
        result.embeddedResultIndex = embeddedResults.length;
        embeddedResults.push(getEmbeddedTokenization(langageId, line, embeddedLanguage, embeddedLanguageStart, embeddedLanguageEnd, topContexts, tokenizersToLoad));
      }
    } else {
      for (const embeddedLanguage of Object.keys(topContexts)) {
        topContexts[embeddedLanguage] = undefined;
      }
    }
  }
  return {
    tokenizersToLoad,
    embeddedResults
  };
};`
  await patchFile(syntaxHighlightingWorkerPath, occurrence, replacement)
}

await patchDynamicWebExtensionTokenizerUrls()
await patchNestedEmbeddedTokenizers()

await cp(
  join(root, '.tmp', 'dist', 'dist', 'editorWorkerMain.js'),
  join(root, 'dist', commitHash, 'packages', 'editor-worker', 'dist', 'editorWorkerMain.js'),
)

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/editorWorkerMain.js')
const remoteUrl = getRemoteUrl(workerPath)

let newContent = content
if (content.includes('// const editorWorkerUrl = ')) {
  const occurrence = `// const editorWorkerUrl = \`\${assetDir}/packages/editor-worker/dist/editorWorkerMain.js\`
const editorWorkerUrl = \`${remoteUrl}\``
  const replacement = `const editorWorkerUrl = \`\${assetDir}/packages/editor-worker/dist/editorWorkerMain.js\``
  newContent = newContent.replace(occurrence, replacement)
}
newContent = newContent.replace(
  `const editorWorkerUrl = \`${remoteUrl}\``,
  'const editorWorkerUrl = `${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`',
)
if (newContent !== content) {
  await writeFile(rendererWorkerPath, newContent)
}

const rendererProcessPath = join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')

const replace = async ({ uri, occurrence, replacement }) => {
  const content = await readFile(uri, 'utf8')
  const newContent = content.replace(occurrence, replacement)
  await writeFile(uri, newContent)
}

await replace({
  uri: rendererProcessPath,
  occurrence: `const editorWorkerUrl = \`${remoteUrl}\``,
  replacement: 'const editorWorkerUrl = `${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`',
})

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
