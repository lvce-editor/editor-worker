import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { DiagnosticTag } from '../Diagnostic/Diagnostic.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as EditorViewRows from '../EditorViewRows/EditorViewRows.ts'
import * as GetHorizontalVisibleRange from '../GetHorizontalVisibleRange/GetHorizontalVisibleRange.ts'
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

const getUnnecessaryRanges = (
  diagnostics: readonly any[],
  rowIndex: number,
  textLength: number,
  visibleStartColumn: number,
  line: string,
  hasLine: boolean,
  tabSize: number,
): readonly { readonly start: number; readonly end: number }[] => {
  const visibleStart = hasLine ? GetHorizontalVisibleRange.getHorizontalDisplayColumn(line, visibleStartColumn, tabSize) : visibleStartColumn
  return diagnostics
    .filter((diagnostic) => diagnostic.tags?.includes(DiagnosticTag.Unnecessary))
    .flatMap((diagnostic) => {
      if (rowIndex < diagnostic.rowIndex || rowIndex > diagnostic.endRowIndex) {
        return []
      }
      const diagnosticStart = rowIndex === diagnostic.rowIndex ? diagnostic.columnIndex : 0
      const diagnosticEnd = rowIndex === diagnostic.endRowIndex ? diagnostic.endColumnIndex : line.length
      const startColumn = hasLine ? GetHorizontalVisibleRange.getHorizontalDisplayColumn(line, diagnosticStart, tabSize) : diagnosticStart
      const endColumn = hasLine ? GetHorizontalVisibleRange.getHorizontalDisplayColumn(line, diagnosticEnd, tabSize) : diagnosticEnd
      const start = Math.max(0, startColumn - visibleStart)
      const end = Math.min(textLength, endColumn - visibleStart)
      return start < end ? [{ end, start }] : []
    })
    .toSorted((left, right) => left.start - right.start)
}

const getTokenParts = (
  textInfos: any,
  ranges: readonly { readonly start: number; readonly end: number }[],
): readonly { readonly className: string; readonly text: string }[] => {
  const parts: { className: string; text: string }[] = []
  let offset = 0
  for (let index = 0; index < textInfos.length; index += 2) {
    const tokenText = textInfos[index]
    const tokenClassName = textInfos[index + 1]
    const tokenEnd = offset + tokenText.length
    const boundaries = new Set([offset, tokenEnd])
    for (const range of ranges) {
      if (range.start > offset && range.start < tokenEnd) {
        boundaries.add(range.start)
      }
      if (range.end > offset && range.end < tokenEnd) {
        boundaries.add(range.end)
      }
    }
    const sortedBoundaries = [...boundaries].toSorted((left, right) => left - right)
    for (let boundaryIndex = 0; boundaryIndex < sortedBoundaries.length - 1; boundaryIndex++) {
      const start = sortedBoundaries[boundaryIndex]
      const end = sortedBoundaries[boundaryIndex + 1]
      const unnecessary = ranges.some((range) => start >= range.start && end <= range.end)
      parts.push({
        className: unnecessary ? MergeClassNames.mergeClassNames(tokenClassName, 'EditorTokenUnnecessary') : tokenClassName,
        text: tokenText.slice(start - offset, end - offset),
      })
    }
    offset = tokenEnd
  }
  return parts
}

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
  problemsHighlightedRow = -1,
  diagnostics: readonly any[] = [],
  deltaX = 0,
  width = Infinity,
  charWidth = 1,
  tabSize = 2,
  lines: readonly string[] = [],
  horizontalVirtualizationThreshold = 500,
  horizontalVisibleRanges: readonly { readonly end: number; readonly rowIndex: number; readonly start: number }[] = [],
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
    const line = lines[rowIndex] || ''
    const visibleRange =
      horizontalVisibleRanges.find((range) => range.rowIndex === rowIndex) ||
      GetHorizontalVisibleRange.getHorizontalVisibleRange(line, deltaX, width, charWidth, tabSize, horizontalVirtualizationThreshold)
    const rowDecorations = endOfLineDecorations.filter(
      (decoration) => decoration.rowIndex === rowIndex && (!lines[rowIndex] || visibleRange.end >= line.length),
    )
    let rowTextLength = 0
    for (let index = 0; index < textInfo.length; index += 2) {
      rowTextLength += textInfo[index].length
    }
    const tokenParts = getTokenParts(
      textInfo,
      getUnnecessaryRanges(diagnostics, rowIndex, rowTextLength, visibleRange.start, line, lines[rowIndex] !== undefined, tabSize),
    )
    let className = ClassNames.EditorRow
    if (rowIndex === highlightedLine) {
      className = MergeClassNames.mergeClassNames(className, ClassNames.EditorRowHighlighted)
    }
    if (rowIndex === problemsHighlightedRow) {
      className = MergeClassNames.mergeClassNames(className, 'EditorProblemsHighlightedRow')
    }
    dom.push({
      childCount: tokenParts.length + rowDecorations.length,
      className,
      translate: difference === 0 ? '' : Px.px(difference),
      type: VirtualDomElements.Div,
    })
    for (const { className, text: tokenText } of tokenParts) {
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
