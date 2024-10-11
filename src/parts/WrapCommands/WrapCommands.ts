import * as Editors from '../Editors/Editors.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'
import * as UnwrappedCommands from '../UnwrappedCommands/UnwrappedCommands.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as WrapWidgetCommand from '../WrapWidgetCommand/WrapWidgetCommand.ts'

const widgetCommands = {
  'ColorPicker.handleSliderPointerDown': WidgetId.ColorPicker,
  'ColorPicker.handleSliderPointerMove': WidgetId.ColorPicker,
  'FindWidget.focusNext': WidgetId.Find,
  'FindWidget.focusPrevious': WidgetId.Find,
  'FindWidget.close': WidgetId.Find,
  'FindWidget.focusIndex': WidgetId.Find,
  'FindWidget.focusFirst': WidgetId.Find,
  'FindWidget.focusLast': WidgetId.Find,
} as any

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also
const wrapCommand =
  (fn: any) =>
  async (editorUid: number, ...args: any[]) => {
    const oldInstance = Editors.get(editorUid)
    const newEditor = await fn(oldInstance.newState, ...args)
    Editors.set(editorUid, oldInstance.newState, newEditor)
    // TODO if possible, rendering should be sync
    const commands = await RenderEditor.renderEditor(editorUid)
    console.log({ commands })
    newEditor.commands = commands
    return newEditor
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
