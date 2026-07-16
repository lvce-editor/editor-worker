const renameProvider = {
  languageId: 'rename-test',
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

export const activate = () => {
  vscode.registerRenameProvider(renameProvider)
}
