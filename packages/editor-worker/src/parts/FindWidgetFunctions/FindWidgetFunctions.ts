import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'

export const loadContent = async (state: FindWidgetState, parentUid: number): Promise<FindWidgetState> => {
  const { uid } = state
  const editor = GetEditor.getEditor(parentUid)
  const { x, y, width, height } = editor
  await FindWidgetWorker.invoke('FindWidget.create', uid, x, y, width, height, parentUid)
  await FindWidgetWorker.invoke('FindWidget.loadContent', uid)
  const diff = await FindWidgetWorker.invoke('FindWidget.diff2', uid)
  const commands = await FindWidgetWorker.invoke('FindWidget.render2', uid, diff)
  console.log({ commands })
  return {
    ...state,
    commands,
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

// TODO move these to worker
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
