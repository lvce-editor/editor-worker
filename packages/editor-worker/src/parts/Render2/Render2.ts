import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const render2 = (uid: number, _diffResult: readonly number[]): readonly any[] => {
  const editor = EditorStates.get(uid)
  if (!editor) {
    return []
  }
  const { newState, oldState } = editor
  // Diagnostics can change after the caller calculated its diff in a separate RPC.
  const diffResult = Diff.diff(oldState, newState)
  EditorStates.set(uid, newState, newState)
  const commands = ApplyRender.applyRender(oldState, newState, diffResult)
  return commands
}
