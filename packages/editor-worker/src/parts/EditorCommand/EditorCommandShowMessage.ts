import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'
import * as LocalWidgetId from '../WidgetId/WidgetId.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorMessageDismissalState from '../EditorMessageDismissalState/EditorMessageDismissalState.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

const defaultMessageDelay = 3000

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
export const editorShowMessage = async (editor, rowIndex, columnIndex, message, _isError) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  Assert.string(message)
  const x = await EditorPosition.getCursorX(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
  const existingWidget = editor.widgets.find((widget: any) => widget.id === LocalWidgetId.Message)
  const uid = existingWidget?.newState.uid ?? Id.create()
  const newState = { message, uid, x, y }
  const widget = {
    id: LocalWidgetId.Message,
    newState,
  }
  const newEditor = {
    ...editor,
    widgets: [...editor.widgets.filter((item: any) => item.id !== LocalWidgetId.Message), widget],
  }
  if (typeof editor.uid === 'number') {
    const timeout = setTimeout(async () => {
      EditorMessageDismissalState.clear(editor.uid)
      const latestInstance = EditorStates.get(editor.uid)
      if (!latestInstance) {
        return
      }
      const latestEditor = latestInstance.newState
      const latestWidget = latestEditor.widgets.find((item: any) => item.id === LocalWidgetId.Message)
      if (latestWidget?.newState.uid !== uid) {
        return
      }
      const editorWithoutMessage = {
        ...latestEditor,
        widgetRevision: WidgetRevision.next(editor.uid),
        widgets: RemoveEditorWidget.removeEditorWidget(latestEditor.widgets, LocalWidgetId.Message),
      }
      EditorStates.set(editor.uid, latestEditor, editorWithoutMessage)
      await RendererWorker.invoke('Editor.renderPending', editor.uid)
    }, editor.messageDelay ?? defaultMessageDelay)
    EditorMessageDismissalState.set(editor.uid, { timeout })
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
  return await editorShowMessage(editor, rowIndex, columnIndex, message, true)
}
