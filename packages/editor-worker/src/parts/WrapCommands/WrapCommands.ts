import * as Editors from '../EditorStates/EditorStates.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'

const pendingCommands = new Map<number, Promise<void>>()

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also

const runCommand = async (editorUid: number, fn: any, args: any[]) => {
  const oldInstance = Editors.get(editorUid)
  const state = oldInstance.newState
  const newEditor = await fn(state, ...args)
  if (state === newEditor) {
    return newEditor
  }
  const newEditorWithDerivedState = await UpdateDerivedState.updateDerivedState(state, newEditor)

  // TODO if editor did not change, no need to update furthur

  // TODO combine neweditor with latest editor?

  Editors.set(editorUid, state, newEditorWithDerivedState)
  return newEditorWithDerivedState
}

export const wrapCommand =
  (fn: any) =>
  async (editorUid: number, ...args: any[]) => {
    const previousCommand = pendingCommands.get(editorUid) || Promise.resolve()
    const command = previousCommand.catch(() => {}).then(() => runCommand(editorUid, fn, args))
    const settledCommand = command.then(
      () => {},
      () => {},
    )
    pendingCommands.set(editorUid, settledCommand)
    try {
      return await command
    } finally {
      if (pendingCommands.get(editorUid) === settledCommand) {
        pendingCommands.delete(editorUid)
      }
    }
  }
