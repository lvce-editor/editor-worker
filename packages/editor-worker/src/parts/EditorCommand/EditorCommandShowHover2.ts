import { WidgetId } from '@lvce-editor/constants'
import type { HoverState } from '../HoverState/HoverState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HoverWidgetFactory from '../HoverWidgetFactory/HoverWidgetFactory.ts'
import * as LoadHoverContent from '../LoadHoverContent/LoadHoverContent.ts'

const newStateGenerator = async (state: HoverState): Promise<HoverState> => {
  return LoadHoverContent.loadHoverContent(state)
}

export const showHover2 = async (editor: any): Promise<any> => {
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Hover, FocusKey.FocusEditorHover, editor, HoverWidgetFactory.create, newStateGenerator)
}
