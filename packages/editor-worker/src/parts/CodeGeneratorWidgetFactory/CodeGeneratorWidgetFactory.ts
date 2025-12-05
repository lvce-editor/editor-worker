import { WidgetId } from '@lvce-editor/constants'
import type { CodeGeneratorWidget } from '../CodeGeneratorWidget/CodeGeneratorWidget.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'
import * as Id from '../Id/Id.ts'

export const create = (): CodeGeneratorWidget => {
  const completionUid = Id.create()
  const widget: CodeGeneratorWidget = {
    id: WidgetId.CodeGenerator,
    newState: {
      focused: true,
      focusSource: FocusSource.Script,
      height: 0,
      questions: [],
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
    oldState: {
      focused: false,
      focusSource: FocusSource.Unknown,
      height: 0,
      questions: [],
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
  }
  return widget
}
