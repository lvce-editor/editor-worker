import type { Widget } from '../Widget/Widget.ts'
import * as AddWidget from '../AddWidget/AddWidget.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as RenderMethod from '../RenderMethod/RenderMethod.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

interface MessageWidgetState {
  readonly message: string
  readonly uid: number
  readonly x: number
  readonly y: number
}

interface MessageWidget extends Widget<MessageWidgetState> {}

export const render = (widget: MessageWidget): readonly any[] => {
  const { message, uid, x, y } = widget.newState
  const dom = [
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames('Viewlet', 'EditorMessage', 'EditorMessageText', 'EditorOverlayMessage'),
      style: `left:${x}px;top:${y}px;`,
      type: VirtualDomElements.Div,
    },
    text(message),
  ]
  return [[RenderMethod.SetDom2, uid, dom]]
}

export const add = (widget: MessageWidget): readonly any[] => {
  return AddWidget.addWidget(widget, 'EditorMessage', render)
}

export { remove } from '../EditorHoverWidget/EditorHoverWidget.ts'
