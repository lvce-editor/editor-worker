import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Assert from '../Assert/Assert.ts'
import * as EditorMessageWidget from '../EditorMessageWidget/EditorMessageWidget.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as LocalWidgetId from '../WidgetId/WidgetId.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

const state = {
  timeout: -1,
}

const removeMessageWidget = (editor: any): any => {
  const widgets = editor.widgets.filter((widget: any) => widget.id !== LocalWidgetId.Message)
  if (widgets.length === editor.widgets.length) {
    return editor
  }
  return {
    ...editor,
    widgets,
  }
}

const hideMessage = async (editorUid: number): Promise<void> => {
  const latest = EditorStates.get(editorUid)
  if (!latest) {
    return
  }
  const newEditor = removeMessageWidget(latest.newState)
  if (newEditor === latest.newState) {
    return
  }
  EditorStates.set(editorUid, latest.newState, newEditor)
  await RendererWorker.invoke('Editor.rerender', editorUid)
}

/**
 *
 * @param {any} editor
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @param {string} message
 * @param {boolean} isError
 * @returns
 */
// @ts-ignore
export const editorShowMessage = async (editor, rowIndex, columnIndex, message, isError) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  Assert.string(message)
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
  const newEditor = EditorMessageWidget.addToEditor(editor, message, x, y)

  clearTimeout(state.timeout)
  state.timeout = -1
  if (!isError) {
    const handleTimeout = () => {
      state.timeout = -1
      void hideMessage(editor.uid)
    }

    // TODO use wrapper timing module instead of this
    // @ts-ignore
    state.timeout = setTimeout(handleTimeout, 3000)
  }
  return newEditor
}

/**
 *
 * @param {any} editor
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @param {string} message
 * @returns
 */
// @ts-ignore
export const showErrorMessage = async (editor, rowIndex, columnIndex, message) => {
  return editorShowMessage(editor, rowIndex, columnIndex, message, /* isError */ true)
}
