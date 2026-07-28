import type { Problem } from '../Problem/Problem.ts'
import * as Editors from '../EditorStates/EditorStates.ts'

export const getProblems = async (): Promise<readonly Problem[]> => {
  const keys = Editors.getKeys()
  const diagnostics = keys.flatMap((key) => {
    const numericKey = Number(key)
    const editor = Editors.get(numericKey)
    if (!editor?.newState) {
      return []
    }
    return editor.newState.diagnostics
  })
  return diagnostics
}
