import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as GetFindState from '../GetFindState/GetFindState.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const isFind = (widget: any) => {
  return widget.id === WidgetId.Find
}
// TODO don't call renderer worker, set editor state
// TODO this function should be synchronous
export const focusIndex = (editor: any, index: number): any => {
  const findState = GetFindState.getFindState(editor)
  if (!findState) {
    return editor
  }
  const { value, matches, matchIndex } = findState
  if (index === matchIndex) {
    return editor
  }
  const { widgets } = editor
  const childIndex = widgets.findIndex(isFind)
  const childWidget = widgets[childIndex]

  // TODO find next match and highlight it
  const matchRowIndex = matches[index * 2]
  const matchColumnIndex = matches[index * 2 + 1]
  const newSelections = new Uint32Array([matchRowIndex, matchColumnIndex, matchRowIndex, matchColumnIndex + value.length])
  const newState: FindWidgetState = {
    ...findState,
    matchIndex: index,
  }
  const newWidget = {
    ...childWidget,
    newState,
  }
  const newWidgets = [...widgets.slice(0, childIndex), newWidget, ...widgets.slice(childIndex + 1)]
  return {
    ...editor,
    selections: newSelections,
    widgets: newWidgets,
  }
}

export const focusFirst = (editor: any): any => {
  const findState = GetFindState.getFindState(editor)
  if (!findState) {
    return editor
  }
  return focusIndex(editor, 0)
}

export const focusLast = (editor: any): any => {
  const findState = GetFindState.getFindState(editor)
  if (!findState) {
    return editor
  }
  const { matchCount } = findState
  return focusIndex(editor, matchCount - 1)
}

export const focusNext = (editor: any): any => {
  const findState = GetFindState.getFindState(editor)
  if (!findState) {
    return editor
  }
  const { matchIndex, matchCount } = findState
  if (matchIndex === matchCount - 1) {
    return focusFirst(editor)
  }
  return focusIndex(editor, matchIndex + 1)
}

export const focusPrevious = (editor: any): any => {
  const findState = GetFindState.getFindState(editor)
  if (!findState) {
    return editor
  }
  const { matchIndex } = findState
  if (matchIndex === 0) {
    return focusLast(editor)
  }
  return focusIndex(editor, matchIndex - 1)
}
