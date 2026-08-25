import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as EditorViewRows from '../EditorViewRows/EditorViewRows.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as Px from '../Px/Px.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const editorLineDecorationNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorLineDecoration,
  type: VirtualDomElements.Span,
}

const mergeConflictActions = [
  { action: 'current', label: 'Accept Current Change' },
  { action: 'incoming', label: 'Accept Incoming Change' },
  { action: 'both', label: 'Accept Both Changes' },
] as const

const addMergeConflictActions = (dom: VirtualDomNode[], rowIndex: number): void => {
  dom.push({
    childCount: mergeConflictActions.length,
    className: 'MergeConflictActions',
    'data-rowIndex': rowIndex,
    onMouseDown: DomEventListenerFunctions.HandleMergeConflictActionsMouseDown,
    type: VirtualDomElements.Div,
  })
  for (const { action, label } of mergeConflictActions) {
    dom.push(
      {
        ariaLabel: `${label} at line ${rowIndex + 1}`,
        childCount: 1,
        className: 'MergeConflictAction',
        'data-action': action,
        'data-rowIndex': rowIndex,
        onClick: DomEventListenerFunctions.HandleMergeConflictActionClick,
        title: label,
        type: VirtualDomElements.Button,
      },
      text(label),
    )
  }
}

export const getEditorRowsVirtualDom = (
  textInfos: any,
  differences: any,
  lineNumbers = true,
  highlightedLine = -1,
  visibleLineIndices: readonly number[] = [],
  endOfLineDecorations: readonly { readonly rowIndex: number; readonly text: string }[] = [],
  visibleViewLineIndices: readonly number[] = [],
): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = []
  const actualViewRows =
    visibleViewLineIndices.length === 0
      ? Array.from({ length: textInfos.length }, (_, index) => visibleLineIndices[index] ?? index)
      : visibleViewLineIndices
  let textInfoIndex = 0
  for (const viewRow of actualViewRows) {
    if (EditorViewRows.isMergeConflictActionsRow(viewRow)) {
      addMergeConflictActions(dom, EditorViewRows.getMergeConflictRowIndex(viewRow))
      continue
    }
    const textInfo = textInfos[textInfoIndex]
    const difference = differences[textInfoIndex]
    const rowIndex = viewRow
    const rowDecorations = endOfLineDecorations.filter((decoration) => decoration.rowIndex === rowIndex)
    let className = ClassNames.EditorRow
    if (rowIndex === highlightedLine) {
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
    textInfoIndex++
  }
  return dom
}
