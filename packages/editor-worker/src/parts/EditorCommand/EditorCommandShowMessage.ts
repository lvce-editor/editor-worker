import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'
import * as LocalWidgetId from '../WidgetId/WidgetId.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

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
export const editorShowMessage = (editor, rowIndex, columnIndex, message, _isError) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  Assert.string(message)
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
  const existingWidget = editor.widgets.find((widget: any) => widget.id === LocalWidgetId.Message)
  const uid = existingWidget?.newState.uid ?? Id.create()
  const newState = { message, uid, x, y }
  const widget = {
    id: LocalWidgetId.Message,
    newState,
  }
  return {
    ...editor,
    widgets: [...editor.widgets.filter((item: any) => item.id !== LocalWidgetId.Message), widget],
  }
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
export const showErrorMessage = (editor, rowIndex, columnIndex, message) => {
  return editorShowMessage(editor, rowIndex, columnIndex, message, true)
}
