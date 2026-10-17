import { activate as activateExtensionApi, registerRenameProvider } from '@lvce-editor/api'

const renameProvider = {
  id: 'rename-test',
  languageId: 'rename-test',
  prepareRename(textDocument, offset) {
    return { offset, uri: textDocument.uri }
  },
  provideRename(textDocument, offset, newName) {
    return {
      canRename: true,
      edits: [
        {
          uri: textDocument.uri,
          edits: [
            {
              offset: 6,
              inserted: newName,
              deleted: 5,
            },
          ],
        },
      ],
    }
  },
}

await activateExtensionApi()
registerRenameProvider(renameProvider)
