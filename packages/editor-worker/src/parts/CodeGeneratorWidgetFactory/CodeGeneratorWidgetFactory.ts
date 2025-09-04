import { WidgetId } from '@lvce-editor/constants'
import type { CodeGeneratorWidget } from '../CodeGeneratorWidget/CodeGeneratorWidget.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'
import * as Id from '../Id/Id.ts'

export const create = (): CodeGeneratorWidget => {
  const completionUid = Id.create()
  const widget: CodeGeneratorWidget = {
    id: WidgetId.CodeGenerator,
    oldState: {
      uid: completionUid,
      questions: [],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      focused: false,
      focusSource: FocusSource.Unknown,
    },
    newState: {
      uid: completionUid,
      questions: [],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      focused: true,
      focusSource: FocusSource.Script,
    },
  }
  return widget
}
