import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../State/State.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import { getEditorGutterDecorations } from '../GetEditorGutterDecorations/GetEditorGutterDecorations.ts'

export const refreshGutterDecorations = async (editor: EditorState): Promise<EditorState> => {
  const gutterDecorations = await getEditorGutterDecorations(editor)
  return {
    ...editor,
    gutterDecorations,
  }
}

export const refreshGutterDecorationsAll = async (): Promise<void> => {
  for (const key of EditorStates.getKeys()) {
    const editor = EditorStates.get(Number(key))?.newState
    if (editor) {
      const refreshedEditor = await refreshGutterDecorations(editor)
      const latest = EditorStates.get(editor.id)
      if (!latest) {
        continue
      }
      EditorStates.set(editor.id, latest.oldState, {
        ...latest.newState,
        gutterDecorations: refreshedEditor.gutterDecorations,
      })
      await RendererWorker.invoke('Editor.renderPending', editor.id)
    }
  }
}
