import { WidgetId } from '@lvce-editor/constants'
import type { CompletionDetailWidget } from '../CompletionDetailWidget/CompletionDetailWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): CompletionDetailWidget => {
  const completionUid = Id.create()
  const completionWidget: CompletionDetailWidget = {
    id: WidgetId.CompletionDetail,
    newState: {
      borderSize: 1,
      content: '',
      height: 0,
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
    oldState: {
      borderSize: 1,
      content: '',
      height: 0,
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
  }
  return completionWidget
}
