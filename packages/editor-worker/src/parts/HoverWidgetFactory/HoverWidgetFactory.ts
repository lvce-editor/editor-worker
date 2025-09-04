import type { HoverWidget } from '../HoverWidget/HoverWidget.ts'
import * as Id from '../Id/Id.ts'
import { WidgetId } from '@lvce-editor/constants'

export const create = (): HoverWidget => {
  const uid = Id.create()
  const widget: HoverWidget = {
    id: WidgetId.Hover,
    oldState: {
      uid: uid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      content: '',
      diagnostics: [],
      documentation: '',
      editorUid: 0,
      lineInfos: [],
    },
    newState: {
      uid: uid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      content: '',
      diagnostics: [],
      documentation: '',
      editorUid: 0,
      lineInfos: [],
    },
  }
  return widget
}
