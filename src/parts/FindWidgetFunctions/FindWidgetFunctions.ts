import * as FindMatchesCaseInsensitive from '../FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.ts'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetFindWidgetHeight from '../GetFindWidgetHeight/GetFindWidgetHeight.ts'
import * as GetMatchCount from '../GetMatchCount/GetMatchCount.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as SetFindWidgetFocus from '../SetFindWidgetFocus/SetFindWidgetFocus.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'

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
    editorUid: editor.uid,
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
  if (state.focus === FocusKey.FindWidget) {
    return state
  }
  await SetFocus.setFocus(FocusKey.FindWidget)
  return {
    ...state,
    focus: FocusKey.FindWidget,
  }
}

export const handleBlur = async (state: FindWidgetState): Promise<FindWidgetState> => {
  await SetFocus.setFocus(FocusKey.Empty)
  return state
}

export const toggleReplace = (state: FindWidgetState): FindWidgetState => {
  const newExpanded = !state.replaceExpanded
  const newHeight = GetFindWidgetHeight.getFindWidgetHeight(newExpanded)
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

export const handleToggleReplaceFocus = async (state: FindWidgetState): Promise<FindWidgetState> => {
  if (state.focus === FocusKey.FocusFindWidgetToggleReplace) {
    return state
  }
  await SetFocus.setFocus(FocusKey.FocusFindWidgetToggleReplace)
  return {
    ...state,
    focus: FocusKey.FocusFindWidgetToggleReplace,
  }
}

export const handleReplaceFocus = async (state: FindWidgetState): Promise<FindWidgetState> => {
  if (state.focus === FocusKey.FocusFindWidgetReplace) {
    return state
  }
  await SetFocus.setFocus(FocusKey.FocusFindWidgetReplace)
  return {
    ...state,
    focus: FocusKey.FocusFindWidgetReplace,
    focusSource: FocusSource.User,
  }
}

export const focusReplace = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetReplace)
}

export const focusFind = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FindWidget)
}

export const handleReplaceInput = (state: FindWidgetState): FindWidgetState => {
  // TODO
  return state
}

export const focusToggleReplace = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetToggleReplace)
}

export const handleReplaceAllFocus = async (state: FindWidgetState): Promise<FindWidgetState> => {
  if (state.focus === FocusKey.FocusFindWidgetReplaceAllButton) {
    return state
  }
  await SetFocus.setFocus(FocusKey.FocusFindWidgetReplaceAllButton)
  return {
    ...state,
    focus: FocusKey.FocusFindWidgetReplaceAllButton,
  }
}

export const focusReplaceButton = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetReplaceButton)
}

export const focusReplaceAllButton = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetReplaceAllButton)
}

export const focusPreviousMatchButton = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetPreviousMatchButton)
}

export const focusNextMatchButton = async (state: FindWidgetState): Promise<FindWidgetState> => {
  return SetFindWidgetFocus.setFindWidgetFocus(state, FocusKey.FocusFindWidgetNextMatchButton)
}

export * from '../FindWidgetFocusCloseButton/FindWidgetFocusCloseButton.ts'
