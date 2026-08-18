import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as Px from '../Px/Px.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const editorLineDecorationNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorLineDecoration,
  type: VirtualDomElements.Span,
}

export const getEditorRowsVirtualDom = (
  textInfos: any,
  differences: any,
  lineNumbers = true,
  highlightedLine = -1,
  visibleLineIndices: readonly number[] = [],
  endOfLineDecorations: readonly { readonly rowIndex: number; readonly text: string }[] = [],
): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = []
  for (let i = 0; i < textInfos.length; i++) {
    const textInfo = textInfos[i]
    const difference = differences[i]
    const rowIndex = visibleLineIndices[i] ?? i
    const rowDecorations = endOfLineDecorations.filter((decoration) => decoration.rowIndex === rowIndex)
    let className = ClassNames.EditorRow
    if (i === highlightedLine) {
      className = MergeClassNames.mergeClassNames(className, ClassNames.EditorRowHighlighted)
    }
    dom.push({
      childCount: textInfo.length / 2 + rowDecorations.length,
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
    for (const decoration of rowDecorations) {
      dom.push(editorLineDecorationNode, text(decoration.text))
    }
  }
  return dom
}
