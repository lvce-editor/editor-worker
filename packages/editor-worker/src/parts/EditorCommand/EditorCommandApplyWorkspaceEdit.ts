import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

// TODO maybe use a separate worker for bulk edits and bulk edit history

const sortEditsDescending = (edits: readonly any[]): readonly any[] => {
  return edits.toSorted((a, b) => b.offset - a.offset)
}

export const applyEditsToText = (text: string, edits: readonly any[]): string => {
  let newText = text
  for (const edit of sortEditsDescending(edits)) {
    newText = newText.slice(0, edit.offset) + edit.inserted + newText.slice(edit.offset + edit.deleted)
  }
  return newText
}

export const getTextChanges = (editor: any, edits: readonly any[]): readonly any[] => {
  const textChanges: any[] = []
  for (const edit of sortEditsDescending(edits)) {
    const startPosition = TextDocument.positionAt(editor, edit.offset)
    const endPosition = TextDocument.positionAt(editor, edit.offset + edit.deleted)
    const deleted = TextDocument.getSelectionText(editor, { end: endPosition, start: startPosition })
    const textChange = {
      deleted,
      end: endPosition,
      inserted: [edit.inserted],
      origin: EditOrigin.Rename,
      start: startPosition,
    }
    textChanges.push(textChange)
  }
  return textChanges
}

const groupEditsByUri = (changes: readonly any[]): ReadonlyMap<string, readonly any[]> => {
  const editsByUri = new Map<string, any[]>()
  for (const change of changes) {
    const edits = editsByUri.get(change.uri)
    if (edits) {
      edits.push(...change.edits)
    } else {
      editsByUri.set(change.uri, [...change.edits])
    }
  }
  return editsByUri
}

const getOpenEditor = (currentEditor: any, uri: string): any => {
  if (currentEditor.uri === uri) {
    return currentEditor
  }
  for (const key of EditorStates.getKeys()) {
    const editor = EditorStates.get(Number(key))?.newState
    if (editor && !editor.initial && editor.uri === uri && editor.applicationId === currentEditor.applicationId) {
      return editor
    }
  }
  return undefined
}

export const applyWorkspaceEdit = async (editor: any, changes: readonly any[]): Promise<any> => {
  Assert.object(editor)
  Assert.array(changes)
  let currentEditor = editor
  const editsByUri = groupEditsByUri(changes)
  for (const [uri, edits] of editsByUri) {
    const openEditor = getOpenEditor(currentEditor, uri)
    if (openEditor) {
      const textChanges = getTextChanges(openEditor, edits)
      const updatedEditor = await Editor.scheduleDocumentAndCursorsSelections(openEditor, textChanges)
      if (openEditor.uid === currentEditor.uid) {
        currentEditor = updatedEditor
      }
      continue
    }
    const text = await ApplicationRpc.readFile(editor.applicationId, uri)
    const newText = applyEditsToText(text, edits)
    await ApplicationRpc.invoke(editor.applicationId, 'FileSystem.writeFile', uri, newText)
  }
  return currentEditor
}
