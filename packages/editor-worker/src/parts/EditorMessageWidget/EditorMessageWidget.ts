import type { Widget } from '../Widget/Widget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as GetEditorMessageVirtualDom from '../GetEditorMessageVirtualDom/GetEditorMessageVirtualDom.ts'
import * as Id from '../Id/Id.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as LocalWidgetId from '../WidgetId/WidgetId.ts'

interface MessageWidgetState {
  readonly message: string
  readonly uid: number
  readonly x: number
  readonly y: number
}

interface MessageWidget extends Widget<MessageWidgetState> {}

const create = (message: string, x: number, y: number, existingWidget?: MessageWidget): MessageWidget => {
  const uid = existingWidget?.newState.uid ?? Id.create()
  const widgetState = {
    message,
    uid,
    x,
    y,
  }
  return {
    id: LocalWidgetId.Message,
    newState: widgetState,
    oldState: existingWidget?.newState ?? widgetState,
  }
}

export const render = (widget: MessageWidget): readonly any[] => {
  const { message, uid, x, y } = widget.newState
  const dom = GetEditorMessageVirtualDom.getEditorMessageVirtualDom(message, x, y)
  return [[RenderMethod.SetDom2, uid, dom]]
}

export const add = (widget: MessageWidget): readonly any[] => {
  return AddWidget.addWidget(widget, 'EditorMessage', render)
}

export const remove = (widget: MessageWidget): readonly any[] => {
  return [['Viewlet.dispose', widget.newState.uid]]
}

export const addToEditor = (editor: any, message: string, x: number, y: number): any => {
  const existingWidget = editor.widgets.find((widget: any) => widget.id === LocalWidgetId.Message)
  const widget = create(message, x, y, existingWidget)
  const widgets = [...editor.widgets.filter((item: any) => item.id !== LocalWidgetId.Message), widget]
  return {
    ...editor,
    widgets,
  }
}
