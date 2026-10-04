import type { EditorState } from '../State/State.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetScrollBarSize from '../ScrollBarFunctions/ScrollBarFunctions.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export interface TextAppendPaths {
  readonly cursorIndex: number
  readonly cursorPath: readonly number[]
  readonly textIndex: number
  readonly textPath: readonly number[]
}

const getChildCount = (node: VirtualDomNode): number => node.childCount || 0

export const getTextAppendPaths = (dom: readonly VirtualDomNode[]): TextAppendPaths | undefined => {
  if (dom.length === 0) {
    return undefined
  }
  let textIndex = -1
  let cursorIndex = -1
  let textPath: readonly number[] = []
  let cursorPath: readonly number[] = []
  let numberOfRows = 0
  let numberOfCursors = 0

  const visit = (index: number, path: readonly number[]): number => {
    const node = dom[index]
    if (!node) {
      return index
    }
    if (node.className === 'EditorRow' || node.className?.startsWith('EditorRow ')) {
      numberOfRows++
      const span = dom[index + 1]
      const text = dom[index + 2]
      if (node.childCount !== 1 || span?.type !== VirtualDomElements.Span || span.childCount !== 1 || text?.type !== VirtualDomElements.Text) {
        numberOfRows = -100
      } else {
        textIndex = index + 2
        textPath = [...path, 0, 0]
      }
    }
    if (node.className === 'EditorCursor') {
      numberOfCursors++
      if (node.childCount === 0) {
        cursorIndex = index
        cursorPath = path
      } else {
        numberOfCursors = -100
      }
    }
    let nextIndex = index + 1
    const childCount = getChildCount(node)
    for (let childIndex = 0; childIndex < childCount; childIndex++) {
      nextIndex = visit(nextIndex, [...path, childIndex])
    }
    return nextIndex
  }

  const endIndex = visit(0, [])
  if (endIndex !== dom.length || numberOfRows !== 1 || numberOfCursors !== 1 || textIndex < 0 || cursorIndex < 0) {
    return undefined
  }
  return { cursorIndex, cursorPath, textIndex, textPath }
}

const isEmpty = (value: readonly unknown[] | undefined): boolean => !value || value.length === 0

const sameValues = (left: readonly number[] = [], right: readonly number[] = []): boolean => {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

const isPlainTextLine = ({ languageId, lines, textInfos }: EditorState): boolean => {
  return languageId === 'plaintext' && lines.length === 1 && textInfos.length === 1 && textInfos[0]?.length === 2 && textInfos[0][0] === lines[0]
}

export const canRenderPlainTextAppend = (oldState: EditorState, newState: EditorState): boolean => {
  const { lines: oldLines, textInfos: oldTextInfos } = oldState
  const { lines: newLines, textInfos: newTextInfos } = newState
  if (!isPlainTextLine(oldState) || !isPlainTextLine(newState)) {
    return false
  }
  const oldLine = oldLines[0]
  const newLine = newLines[0]
  if (newLine.length <= oldLine.length || !newLine.startsWith(oldLine) || /[\r\n]/.test(newLine.slice(oldLine.length))) {
    return false
  }
  if (
    oldState.initial ||
    newState.initial ||
    !oldState.focused ||
    !newState.focused ||
    oldState.uid !== newState.uid ||
    oldTextInfos[0][1] !== newTextInfos[0][1] ||
    oldState.cursorInfos.length !== 1 ||
    newState.cursorInfos.length !== 1 ||
    oldState.selectionInfos.length > 0 ||
    newState.selectionInfos.length > 0 ||
    oldState.selections.length !== 4 ||
    newState.selections.length !== 4 ||
    oldState.selections[0] !== 0 ||
    oldState.selections[1] !== oldLine.length ||
    oldState.selections[2] !== 0 ||
    oldState.selections[3] !== oldLine.length ||
    newState.selections[0] !== 0 ||
    newState.selections[1] !== newLine.length ||
    newState.selections[2] !== 0 ||
    newState.selections[3] !== newLine.length
  ) {
    return false
  }
  if (
    oldState.breadcrumbsEnabled ||
    newState.breadcrumbsEnabled ||
    oldState.minimapEnabled ||
    newState.minimapEnabled ||
    oldState.lineNumbers !== newState.lineNumbers ||
    oldState.highlightActiveLineNumber !== newState.highlightActiveLineNumber ||
    oldState.highlightedLine !== newState.highlightedLine ||
    oldState.problemsHighlightedRow !== newState.problemsHighlightedRow ||
    oldState.focused !== newState.focused ||
    oldState.roundedSelection !== newState.roundedSelection ||
    oldState.width !== newState.width ||
    oldState.height !== newState.height ||
    oldState.minimumSliderSize !== newState.minimumSliderSize ||
    GetScrollBarSize.getScrollBarSize(oldState.width, oldState.longestLineWidth, oldState.minimumSliderSize) !==
      GetScrollBarSize.getScrollBarSize(newState.width, newState.longestLineWidth, newState.minimumSliderSize) ||
    oldState.minLineY !== newState.minLineY ||
    oldState.maxLineY !== newState.maxLineY ||
    !sameValues(oldState.visibleLineIndices, newState.visibleLineIndices) ||
    !sameValues(oldState.visibleViewLineIndices, newState.visibleViewLineIndices) ||
    (oldState.differences !== newState.differences && !sameValues(oldState.differences, newState.differences)) ||
    oldState.scrollBarHeight !== newState.scrollBarHeight ||
    oldState.uri !== newState.uri ||
    oldState.workspaceUri !== newState.workspaceUri ||
    oldState.assetDir !== newState.assetDir ||
    oldState.loadError !== newState.loadError ||
    oldState.combineWhitespaceTokens !== newState.combineWhitespaceTokens ||
    oldState.widgets?.length > 0 ||
    newState.widgets?.length > 0 ||
    oldState.mergeConflicts.length > 0 ||
    newState.mergeConflicts.length > 0 ||
    !isEmpty(oldState.diagnostics) ||
    !isEmpty(newState.diagnostics) ||
    !isEmpty(oldState.visualDecorations) ||
    !isEmpty(newState.visualDecorations) ||
    !isEmpty(oldState.bracketMatchInfos) ||
    !isEmpty(newState.bracketMatchInfos) ||
    !isEmpty(oldState.endOfLineDecorations) ||
    !isEmpty(newState.endOfLineDecorations) ||
    !isEmpty(oldState.gutterDecorations) ||
    !isEmpty(newState.gutterDecorations) ||
    !isEmpty(oldState.breakPoints) ||
    !isEmpty(newState.breakPoints)
  ) {
    return false
  }
  return true
}

export const getTextAppendPatches = (state: EditorState, paths: TextAppendPaths): readonly any[] => {
  const { cursorInfos, lines } = state
  const patches: any[] = []
  for (const index of paths.textPath) {
    patches.push({ index, type: 7 }) // NavigateChild
  }
  patches.push({ type: 1, value: lines[0] }) // SetText
  for (let index = 0; index < paths.textPath.length; index++) {
    patches.push({ type: 8 }) // NavigateParent
  }
  for (const index of paths.cursorPath) {
    patches.push({ index, type: 7 }) // NavigateChild
  }
  patches.push({ key: 'translate', type: 3, value: cursorInfos[0] }) // SetAttribute
  return patches
}

export const updateTextAppendDom = (oldDom: readonly VirtualDomNode[], state: EditorState, paths: TextAppendPaths): readonly VirtualDomNode[] => {
  const { cursorInfos, lines } = state
  const newDom = [...oldDom]
  newDom[paths.textIndex] = { ...oldDom[paths.textIndex], text: lines[0] }
  newDom[paths.cursorIndex] = { ...oldDom[paths.cursorIndex], translate: cursorInfos[0] }
  return newDom
}
