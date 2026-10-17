import { activate as activateExtensionApi, registerEditorGutterDecorationProvider } from '@lvce-editor/api'

let invocationCount = 0

await activateExtensionApi()
registerEditorGutterDecorationProvider({
  id: 'test.editor-gutter-decoration-provider',
  provideEditorGutterDecorations(textDocument) {
    if (invocationCount++ > 0) {
      return []
    }
    const lines = textDocument.text.split('\n')
    return [
      { rowIndex: 0, type: 'added' },
      ...(lines.length > 1 ? [{ rowIndex: 1, type: 'modified' }] : []),
      ...(lines.length > 2 ? [{ rowIndex: 2, type: 'deleted' }] : []),
    ]
  },
})
