import { WidgetId } from '@lvce-editor/constants'
import type { CompletionDetailWidget } from '../CompletionDetailWidget/CompletionDetailWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): CompletionDetailWidget => {
  const completionUid = Id.create()
  const completionWidget: CompletionDetailWidget = {
    id: WidgetId.CompletionDetail,
    oldState: {
      content: '',
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      borderSize: 1,
    },
    newState: {
      content: '',
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      borderSize: 1,
    },
  }
  return completionWidget
}
