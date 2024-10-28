import { CodeGenratorWidget as CodeGeneratorWidget } from '../CodeGeneratorWidget/CodeGeneratorWidget.ts'
import * as Id from '../Id/Id.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): CodeGeneratorWidget => {
  const completionUid = Id.create()
  const widget: CodeGeneratorWidget = {
    id: WidgetId.CodeGenerator,
    oldState: {
      uid: completionUid,
      questions: [],
    },
    newState: {
      uid: completionUid,
      questions: [],
    },
  }
  return widget
}
