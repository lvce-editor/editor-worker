import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as Px from '../Px/Px.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getPreviewMap = (evaluationPreviews: readonly any[]): Map<number, string> => {
  const previewMap = new Map<number, string>()
  for (const preview of evaluationPreviews) {
    previewMap.set(preview.rowIndex, preview.value)
  }
  return previewMap
}

export const getEditorRowsVirtualDom = (
  textInfos: any,
  differences: any,
  lineNumbers = true,
  highlightedLine = -1,
  evaluationPreviews: readonly any[] = [],
  minLineY = 0,
): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = []
  const previewMap = getPreviewMap(evaluationPreviews)
  for (let i = 0; i < textInfos.length; i++) {
    const textInfo = textInfos[i]
    const difference = differences[i]
    const preview = previewMap.get(i + minLineY)
    let className = ClassNames.EditorRow
    if (i === highlightedLine) {
      className += ' ' + ClassNames.EditorRowHighlighted
    }
    dom.push({
      childCount: textInfo.length / 2 + (preview ? 1 : 0),
      className,
      translate: Px.px(difference),
      type: VirtualDomElements.Div,
    })
    for (let j = 0; j < textInfo.length; j += 2) {
      const tokenText = textInfo[j]
      const className = textInfo[j + 1]
      dom.push(
        {
          childCount: 1,
          className,
          type: VirtualDomElements.Span,
        },
        text(tokenText),
      )
    }
    if (preview) {
      dom.push(
        {
          childCount: 1,
          className: 'EvaluationPreview',
          type: VirtualDomElements.Span,
        },
        text(` ${preview}`),
      )
    }
  }
  return dom
}
