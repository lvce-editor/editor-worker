import * as FindMatchesCaseInsensitive from '../FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.ts'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetMatchCount from '../GetMatchCount/GetMatchCount.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getPosition = (editor: any) => {
  const width = 300
  const height = 30
  const paddingTop = 10
  const paddingRight = 20
  const x = editor.x + editor.width - width - paddingRight
  const y = editor.y + paddingTop
  return {
    y,
    x,
    width,
    height,
  }
}

export const loadContent = (editorId: number) => {
  const editor = GetEditor.getEditor(editorId)
  const { selections, lines } = editor
  const startRowIndex = selections[0]
  const startColumnIndex = selections[1]
  const endColumnIndex = selections[3]
  const line = lines[startRowIndex]
  const value = line.slice(startColumnIndex, endColumnIndex)
  const matches = FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, value)
  const matchCount = GetMatchCount.getMatchCount(matches)
  return {
    value,
    matches,
    matchIndex: 0,
    matchCount,
  }
}

export const refresh = (state: FindWidgetState, value = state.value): FindWidgetState => {
  // TODO get focused editor
  const { editorUid } = state
  // highlight locations that match value
  const editor = GetEditor.getEditor(editorUid)
  const { lines } = editor
  const matches = FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, value)
  const matchCount = GetMatchCount.getMatchCount(matches)
  return {
    ...state,
    matches,
    matchIndex: 0,
    matchCount,
    value,
  }
}

export const handleInput = (state: FindWidgetState, value: string): FindWidgetState => {
  return refresh(state, value)
}

export const handleFocus = async (state: FindWidgetState): Promise<FindWidgetState> => {
  const FindWidget = 16
  await RendererWorker.invoke('Focus.setFocus', FindWidget)
  return state
}

export const handleBlur = async (state: FindWidgetState): Promise<FindWidgetState> => {
  const Empty = 0
  await RendererWorker.invoke('Focus.setFocus', Empty)
  return state
}

export const toggleReplace = (state: FindWidgetState): FindWidgetState => {
  const newExpanded = !state.replaceExpanded
  const collapsedHeight = 30
  const expandedHeight = 60
  const newHeight = newExpanded ? expandedHeight : collapsedHeight
  return {
    ...state,
    replaceExpanded: !state.replaceExpanded,
    height: newHeight,
  }
}

// TODO this function should be synchronous
export const focusIndex = async (state: FindWidgetState, index: number): Promise<FindWidgetState> => {
  const { value, matches, matchIndex } = state
  if (index === matchIndex) {
    return state
  }
  // TODO find next match and highlight it
  const matchRowIndex = matches[index * 2]
  const matchColumnIndex = matches[index * 2 + 1]
  // @ts-ignore
  const newSelections = new Uint32Array([matchRowIndex, matchColumnIndex, matchRowIndex, matchColumnIndex + value.length])
  // TODO set selections synchronously and render input match index,
  // input value and new selections at the same time
  // TODO
  await RendererWorker.invoke('Editor.setSelections', newSelections)
  return {
    ...state,
    matchIndex: index,
  }
}

export const focusFirst = (state: FindWidgetState) => {
  return focusIndex(state, 0)
}

export const focusLast = (state: FindWidgetState) => {
  const { matchCount } = state
  return focusIndex(state, matchCount - 1)
}

export const focusNext = (state: FindWidgetState) => {
  const { matchIndex, matchCount } = state
  if (matchIndex === matchCount - 1) {
    return focusFirst(state)
  }
  return focusIndex(state, matchIndex + 1)
}

export const focusPrevious = (state: FindWidgetState) => {
  const { matchIndex } = state
  if (matchIndex === 0) {
    return focusLast(state)
  }
  return focusIndex(state, matchIndex - 1)
}

export const close = async (state: FindWidgetState) => {
  // TODO
  // await Viewlet.closeWidget(uid)
  return {
    ...state,
    disposed: true,
  }
}

export const handleToggleReplaceFocus = (state: FindWidgetState): FindWidgetState => {
  return {
    ...state,
    focus: 'replaceInput',
  }
}
