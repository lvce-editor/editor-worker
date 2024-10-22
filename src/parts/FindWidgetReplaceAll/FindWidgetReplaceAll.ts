import * as GetFindState from '../GetFindState/GetFindState.ts'

export const replaceAll = (editor: any): any => {
  const state = GetFindState.getFindState(editor)
  if (!state) {
    return editor
  }
  const { matches } = state
  console.log({ matches })
  return state
}
