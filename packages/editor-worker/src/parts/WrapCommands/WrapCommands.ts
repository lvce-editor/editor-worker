import * as EditorDiagnosticEffect from '../EditorDiagnosticEffect/EditorDiagnosticEffect.ts'
import * as Editors from '../Editors/Editors.ts'
import * as RenderEditor from '../RenderEditor/RenderEditor.ts'
import * as UnwrappedCommands from '../UnwrappedCommands/UnwrappedCommands.ts'
import { WidgetId } from '@lvce-editor/constants'
import * as WrapWidgetCommand from '../WrapWidgetCommand/WrapWidgetCommand.ts'

const widgetCommands = {
  'ColorPicker.handleSliderPointerDown': WidgetId.ColorPicker,
  'ColorPicker.handleSliderPointerMove': WidgetId.ColorPicker,
  // 'FindWidget.focusNext': WidgetId.Find,
  // 'FindWidget.focusPrevious': WidgetId.Find,
  'FindWidget.close': WidgetId.Find,
  // 'FindWidget.focusIndex': WidgetId.Find,
  // 'FindWidget.focusFirst': WidgetId.Find,
  // 'FindWidget.focusLast': WidgetId.Find,
  'FindWidget.toggleReplace': WidgetId.Find,
  'FindWidget.handleFocus': WidgetId.Find,
  'FindWidget.handleBlur': WidgetId.Find,
  'FindWidget.handleToggleReplaceFocus': WidgetId.Find,
  'FindWidget.handleInput': WidgetId.Find,
  'FindWidget.handleReplaceInput': WidgetId.Find,
  'FindWidget.handleReplaceFocus': WidgetId.Find,
  'FindWidget.focusFind': WidgetId.Find,
  'FindWidget.focusToggleReplace': WidgetId.Find,
  'FindWidget.focusReplace': WidgetId.Find,
  'FindWidget.focusReplaceButton': WidgetId.Find,
  'FindWidget.focusReplaceAllButton': WidgetId.Find,
  'FindWidget.focusNextMatchButton': WidgetId.Find,
  'FindWidget.focusPreviousMatchButton': WidgetId.Find,
  'FindWidget.focusCloseButton': WidgetId.Find,

  // 'EditorCompletion.handleWheel': WidgetId.Completion,
  // 'EditorCompletion.focusFirst': WidgetId.Completion,
  // 'EditorCompletion.focusNext': WidgetId.Completion,
  // 'EditorCompletion.focusPrevious': WidgetId.Completion,
  // 'EditorCompletion.focusIndex': WidgetId.Completion,
  // 'EditorCompletion.focusLast': WidgetId.Completion,
  // 'EditorCompletion.selectCurrent': WidgetId.Completion,
  // 'EditorCompletion.selectIndex': WidgetId.Completion,
} as any

// TODO wrap commands globally, not per editor
// TODO only store editor state in editor worker, not in renderer worker also

const effects = [EditorDiagnosticEffect.editorDiagnosticEffect]

const wrapCommand =
  (fn: any) =>
  async (editorUid: number, ...args: any[]) => {
    const oldInstance = Editors.get(editorUid)
    const newEditor = await fn(oldInstance.newState, ...args)

    for (const effect of effects) {
      if (effect.isActive(oldInstance.newState, newEditor)) {
        effect.apply(newEditor)
      }
    }
    Editors.set(editorUid, oldInstance.newState, newEditor)
    // TODO if possible, rendering should be sync
    const commands = await RenderEditor.renderEditor(editorUid)
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
