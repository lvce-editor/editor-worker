import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

const summarizeState = ({
  charWidth,
  deltaY,
  differences,
  foldingRanges,
  height,
  id,
  initial,
  itemHeight,
  lifecycle,
  lines,
  maxLineY,
  minLineY,
  textInfos,
  uid,
  uri,
  visibleLineIndices,
  visibleViewLineIndices,
  width,
}: any): any => ({
  charWidth: charWidth,
  deltaY: deltaY,
  differences: differences?.length,
  foldingRanges: foldingRanges,
  height: height,
  id: id,
  initial: initial,
  itemHeight: itemHeight,
  lifecycle: lifecycle && { disposed: lifecycle.disposed },
  lines: lines?.length,
  maxLineY: maxLineY,
  minLineY: minLineY,
  textInfos: textInfos?.map((row: any) => row?.length),
  uid: uid,
  uri: uri,
  visibleLineIndices: visibleLineIndices,
  visibleViewLineIndices: visibleViewLineIndices,
  width: width,
})

export const render2 = (uid: number, _diffResult: readonly number[]): readonly any[] => {
  const editor = EditorStates.get(uid)
  if (!editor) {
    return []
  }
  const { newState, oldState } = editor
  // Diagnostics can change after the caller calculated its diff in a separate RPC.
  const diffResult = Diff.diff(oldState, newState)
  EditorStates.set(uid, newState, newState)
  try {
    return ApplyRender.applyRender(oldState, newState, diffResult)
  } catch (error) {
    throw new Error(`[DEBUG-yaml-hover] ${JSON.stringify({ diffResult, newState: summarizeState(newState), oldState: summarizeState(oldState) })}`, {
      cause: error,
    })
  }
}
