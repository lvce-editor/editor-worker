import * as Diff from '../Diff/Diff.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { newState, oldState } = EditorStates.get(uid)
  const result = Diff.diff(oldState, newState)
  return result
}
