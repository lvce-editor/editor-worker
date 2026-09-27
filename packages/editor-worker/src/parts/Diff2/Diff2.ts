import * as Diff from '../Diff/Diff.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const editor = EditorStates.get(uid)
  if (!editor) {
    return []
  }
  const { newState, oldState } = editor
  const result = Diff.diff(oldState, newState)
  return result
}
