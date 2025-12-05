import { WidgetId } from '@lvce-editor/constants'
import type { HoverWidget } from '../HoverWidget/HoverWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): HoverWidget => {
  const uid = Id.create()
  const widget: HoverWidget = {
    id: WidgetId.Hover,
    newState: {
      commands: [],
      content: '',
      diagnostics: [],
      documentation: '',
      editorUid: 0,
      height: 0,
      lineInfos: [],
      uid: uid,
      width: 0,
      x: 0,
      y: 0,
    },
    oldState: {
      commands: [],
      content: '',
      diagnostics: [],
      documentation: '',
      editorUid: 0,
      height: 0,
      lineInfos: [],
      uid: uid,
      width: 0,
      x: 0,
      y: 0,
    },
  }
  return widget
}
