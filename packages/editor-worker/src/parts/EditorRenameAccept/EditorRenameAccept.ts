import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as ExtensionHostRename from '../ExtensionHostRename/ExtensionHostRename.ts'
import * as GetOffsetAtCursor from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'
import * as GetRenameState from '../GetRenameState/GetRenameState.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const getRenameChanges = (editor: any, result: any) => {
  if (!result?.edits) {
    return []
  }
  const changes: any[] = []
  console.log({ result })
  for (const edit of result.edits) {
    const position = TextDocument.positionAt(editor, edit.offset)
    const start = position
    const end = {
      ...position,
      columnIndex: start.columnIndex + edit.deleted,
    }
    const selection = { start, end }
    changes.push({
      start,
      end,
      inserted: [result.inserted],
      deleted: TextDocument.getSelectionText(editor, selection),
      origin: EditOrigin.Rename,
    })
  }
  return changes
}

export const accept = async (editor: any): Promise<any> => {
  const child = GetRenameState.getRenameState(editor)
  if (!child) {
    return editor
  }

  const { widgets } = editor
  const newWidgets = RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Rename)
  // TODO
  const offset = GetOffsetAtCursor.getOffsetAtCursor(editor)

  const result = await ExtensionHostRename.executeRenameProvider(editor, offset, child.newValue)
  const changes = getRenameChanges(editor, result)
  console.log({ changes })
  // 1. ask extension host for rename edits
  // 2. apply rename edit across editor (and whole workspace)
  // 3. close rename widget
  return {
    ...editor,
    focused: true,
    widgets: newWidgets,
  }
}
