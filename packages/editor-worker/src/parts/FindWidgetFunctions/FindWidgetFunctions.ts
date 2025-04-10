import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FindMatchesCaseInsensitive from '../FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetMatchCount from '../GetMatchCount/GetMatchCount.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'

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

export const handleReplaceInput = (state: FindWidgetState, value: string): FindWidgetState => {
  return {
    ...state,
    replacement: value,
  }
}

export * from '../FindWidgetFocusCloseButton/FindWidgetFocusCloseButton.ts'
export * from '../FindWidgetFocusFind/FindWidgetFocusFind.ts'
export * from '../FindWidgetFocusIndex/FindWidgetFocusIndex.ts'
export * from '../FindWidgetFocusNextMatchButton/FindWidgetFocusNextMatchButton.ts'
export * from '../FindWidgetFocusPreviousMatchButton/FindWidgetFocusPreviousMatchButton.ts'
export * from '../FindWidgetFocusReplace/FindWidgetFocusReplace.ts'
export * from '../FindWidgetFocusReplaceAllButton/FindWidgetFocusReplaceAllButton.ts'
export * from '../FindWidgetFocusReplaceButton/FindWidgetFocusReplaceButton.ts'
export * from '../FindWidgetFocusToggleReplaceButton/FindWidgetFocusToggleReplaceButton.ts'
export * from '../FindWidgetHandleBlur/FindWidgetHandleBlur.ts'
export * from '../FindWidgetHandleInput/FindWidgetHandleInput.ts'
export * from '../FindWidgetHandleReplaceAllFocus/FindWidgetHandleReplaceAllFocus.ts'
export * from '../FindWidgetHandleReplaceFocus/FindWidgetHandleReplaceFocus.ts'
export * from '../FindWidgetRefresh/FindWidgetRefresh.ts'
export * from '../FindWidgetToggleReplace/FindWidgetToggleReplace.ts'
export * from '../HandleFindWidgetFocus/HandleFindWidgetFocus.ts'
