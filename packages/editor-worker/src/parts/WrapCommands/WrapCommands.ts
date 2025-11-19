import { WidgetId } from '@lvce-editor/constants'
import * as Editors from '../Editors/Editors.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'
import * as UnwrappedCommands from '../UnwrappedCommands/UnwrappedCommands.ts'
import * as WrapWidgetCommand from '../WrapWidgetCommand/WrapWidgetCommand.ts'

const widgetCommands = {
  'ColorPicker.handleSliderPointerDown': WidgetId.ColorPicker,
  'ColorPicker.handleSliderPointerMove': WidgetId.ColorPicker,
} as any

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also

const wrapCommand =
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

export const wrapCommands = (commands: any) => {
  for (const [key, value] of Object.entries(commands)) {
    if (UnwrappedCommands.keep.includes(key)) {
      continue
    }
    // TODO avoid wrapping functions twice
    const innerWrappedWidgetId = widgetCommands[key]
    const innerWrappedFn = innerWrappedWidgetId ? WrapWidgetCommand.wrapWidgetCommand(innerWrappedWidgetId, value) : value
    commands[key] = wrapCommand(innerWrappedFn)
  }
}
