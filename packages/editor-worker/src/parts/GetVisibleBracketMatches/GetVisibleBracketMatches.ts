import type { BracketPosition } from '../BracketMatching/BracketMatching.ts'
import type { BracketMatchInfo } from '../BracketMatchInfo/BracketMatchInfo.ts'
import type { EditorState } from '../State/State.ts'
import * as BracketMatching from '../BracketMatching/BracketMatching.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as GetX from '../GetX/GetX.ts'

const getPositionKey = (position: BracketPosition): string => `${position.rowIndex}:${position.columnIndex}`

const getInfo = async (
  editor: EditorState,
  position: BracketPosition,
  visibleLineIndices: readonly number[],
  startVisualRow: number,
): Promise<BracketMatchInfo | undefined> => {
  if (!visibleLineIndices.includes(position.rowIndex)) {
    return undefined
  }
  const {
    charWidth,
    differences,
    foldingRanges,
    fontFamily,
    fontSize,
    fontWeight,
    isMonospaceFont,
    letterSpacing,
    lines,
    rowHeight,
    tabSize,
    width,
  } = editor
  const visualRow = EditorFolding.getVisualRowForDocumentRow(position.rowIndex, foldingRanges)
  const relativeRow = visualRow - startVisualRow
  const difference = differences[relativeRow] ?? 0
  const line = lines[position.rowIndex]
  const x = await GetX.getX(
    line,
    position.columnIndex,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    0,
    width,
    charWidth,
    difference,
  )
  const endX = await GetX.getX(
    line,
    position.columnIndex + 1,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    0,
    width,
    charWidth,
    difference,
  )
  return {
    height: rowHeight,
    width: Math.max(1, endX - x),
    x,
    y: relativeRow * rowHeight,
  }
}

export const getVisibleBracketMatches = async (editor: EditorState): Promise<readonly BracketMatchInfo[]> => {
  const { deltaY, foldingRanges, itemHeight, lines, maxLineY, minLineY, selections, visibleLineIndices } = editor
  const actualVisibleLineIndices = visibleLineIndices || Array.from({ length: maxLineY - minLineY }, (_, index) => minLineY + index)
  const startVisualRow = itemHeight ? Math.floor(deltaY / itemHeight) : EditorFolding.getVisualRowForDocumentRow(minLineY, foldingRanges)
  const positions = new Map<string, BracketPosition>()
  for (let i = 0; i < selections.length; i += 4) {
    const startRowIndex = selections[i]
    const startColumnIndex = selections[i + 1]
    const endRowIndex = selections[i + 2]
    const endColumnIndex = selections[i + 3]
    if (startRowIndex !== endRowIndex || startColumnIndex !== endColumnIndex) {
      continue
    }
    const pair = BracketMatching.findMatchingBracket(lines, endRowIndex, endColumnIndex)
    if (!pair) {
      continue
    }
    positions.set(getPositionKey(pair.source), pair.source)
    positions.set(getPositionKey(pair.match), pair.match)
  }
  const infos = await Promise.all(Array.from(positions.values(), (position) => getInfo(editor, position, actualVisibleLineIndices, startVisualRow)))
  return infos.filter((info): info is BracketMatchInfo => info !== undefined)
}
