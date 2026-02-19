import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] => {
  const { newState, oldState } = EditorStates.get(uid)
  EditorStates.set(uid, newState, newState)
  const commands = ApplyRender.applyRender(oldState, newState, diffResult)
  return commands
}
