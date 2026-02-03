import * as Editors from '../Editors/Editors.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also

export const wrapCommand =
  (fn: any) =>
  async (editorUid: number, ...args: any[]) => {
    const oldInstance = Editors.get(editorUid)
    const state = oldInstance.newState
    const newEditor = await fn(state, ...args)
    if (state === newEditor) {
      return newEditor
    }
    // TODO if editor did not change, no need to update furthur

    // TODO combine neweditor with latest editor?

    Editors.set(editorUid, state, newEditor)
    const commands = await RenderEditor.renderEditor(editorUid)
    return {
      ...newEditor,
      commands,
    }
  }
