import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import type { HoverState } from '../HoverState/HoverState.ts'
import * as HoverWidgetFactory from '../HoverWidgetFactory/HoverWidgetFactory.ts'
import * as LoadHoverContent from '../LoadHoverContent/LoadHoverContent.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const newStateGenerator = (state: HoverState): Promise<HoverState> => {
  return LoadHoverContent.loadHoverContent(state)
}

export const showHover2 = async (editor: any) => {
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Hover, FocusKey.FocusEditorHover, editor, HoverWidgetFactory.create, newStateGenerator)
}