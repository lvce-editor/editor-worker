import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import { CodeGeneratorState } from '../CodeGeneratorState/CodeGeneratorState.ts'
import * as CodeGeneratorWidgetFactory from '../CodeGeneratorWidgetFactory/CodeGeneratorWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const newStateGenerator = async (state: CodeGeneratorState): Promise<CodeGeneratorState> => {
  const latestState: CodeGeneratorState = {
    ...state,
  }
  return latestState
}

export const openCodeGenerator = async (editor: any) => {
  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.CodeGenerator,
    FocusKey.FocusCodeGenerator,
    editor,
    CodeGeneratorWidgetFactory.create,
    newStateGenerator,
    fullFocus
  )
}
