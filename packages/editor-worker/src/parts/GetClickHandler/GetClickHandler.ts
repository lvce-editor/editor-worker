import { closeWidgetsMaybe } from '../CloseWidgetsMaybe/CloseWidgetsMaybe.ts'
import * as HandleSingleClickWithAlt from '../HandleSingleClickWithAlt/HandleSingleClickWithAlt.ts'
import * as HandleSingleClickWithCtrl from '../HandleSingleClickWithCtrl/HandleSingleClickWithCtrl.ts'
import * as ModifierKey from '../ModifierKey/ModifierKey.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

const handleSingleClickDefault = (editor: any, position: any) => {
  const widgets = closeWidgetsMaybe(editor.widgets)
  WidgetRevision.next(editor.uid)
  return {
    ...editor,
    focused: true,
    selectionAnchorPosition: position,
    selections: new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
    widgets,
  }
}

export const getClickHandler = (modifier: any) => {
  switch (modifier) {
    case ModifierKey.Alt:
      return HandleSingleClickWithAlt.handleSingleClickWithAlt
    case ModifierKey.Ctrl:
      return HandleSingleClickWithCtrl.handleSingleClickWithCtrl
    default:
      return handleSingleClickDefault
  }
}
