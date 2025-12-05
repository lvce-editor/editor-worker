import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const label1 = {
  childCount: 1,
  className: ClassNames.Label,
  type: VirtualDomElements.Div,
}

const completionHighlight = {
  childCount: 1,
  className: ClassNames.EditorCompletionItemHighlight,
  type: VirtualDomElements.Span,
}

export const getHighlightedLabelDom = (label: any, highlights: any[]) => {
  if (highlights.length === 0) {
    return [label1, text(label)]
  }
  const dom = []
  const labelDom = {
    childCount: 0,
    className: ClassNames.Label,
    type: VirtualDomElements.Div,
  }
  dom.push(labelDom)
  let position = 0
  for (let i = 0; i < highlights.length; i += 2) {
    const highlightStart = highlights[i]
    const highlightEnd = highlights[i + 1]
    if (position < highlightStart) {
      const beforeText = label.slice(position, highlightStart)
      labelDom.childCount++
      dom.push(text(beforeText))
    }
    const highlightText = label.slice(highlightStart, highlightEnd)
    labelDom.childCount++
    dom.push(completionHighlight, text(highlightText))
    position = highlightEnd
  }
  if (position < label.length) {
    const afterText = label.slice(position)
    labelDom.childCount++
    dom.push(text(afterText))
  }
  return dom
}
