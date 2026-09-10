import * as EditorViewport from '../EditorViewport/EditorViewport.ts'

export const getCss = (
  uid: number,
  rowHeight: number,
  scrollBarHeight: number,
  scrollBarTop: number,
  scrollBarWidth: number,
  scrollBarLeft: number,
  deltaY = 0,
): string => {
  const editorSelector = `.Editor[data-uid="${uid}"]`
  const scrollOffset = EditorViewport.getScrollOffset(deltaY, rowHeight)
  const translate = scrollOffset === 0 ? 'none' : `0px -${scrollOffset}px`
  return `${editorSelector} {
  --EditorRowHeight: ${rowHeight}px;
  --ScrollBarHeight: ${scrollBarHeight}px;
  --ScrollBarTop: ${scrollBarTop}px;
  --ScrollBarWidth: ${scrollBarWidth}px;
  --ScrollBarLeft: ${scrollBarLeft}px;
}
${editorSelector} .EditorLayers {
  height: calc(100% + var(--EditorRowHeight));
  translate: ${translate};
}
${editorSelector} .GutterRows {
  flex: none;
  width: 100%;
  translate: ${translate};
}
${editorSelector} .EditorRows,
${editorSelector} .GutterRows {
  display: flex;
  flex-direction: column;
}
${editorSelector} .EditorRow,
${editorSelector} .LineNumber {
  flex: none;
}
${editorSelector} .EditorRow {
  contain: size style;
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
${editorSelector} .MergeConflictActions,
${editorSelector} .MergeConflictActionsGutter {
  box-sizing: border-box;
  flex: none;
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
${editorSelector} .MergeConflictActions {
  align-items: center;
  display: flex;
  gap: 12px;
  padding-left: 4px;
  user-select: none;
}
${editorSelector} .MergeConflictAction {
  appearance: none;
  background: none;
  border: 0;
  color: var(--TextLinkForeground, #3794ff);
  cursor: pointer;
  font: inherit;
  padding: 0;
}
${editorSelector} .MergeConflictAction:hover,
${editorSelector} .MergeConflictAction:focus-visible {
  color: var(--TextLinkActiveForeground, #4daafc);
  outline: none;
  text-decoration: underline;
}
${editorSelector} .EditorProblemsHighlightedRow {
  background: var(--EditorRangeHighlightBackground, rgba(128, 128, 128, 0.18));
  outline: 1px solid var(--EditorRangeHighlightBorder, rgba(128, 128, 128, 0.35));
  outline-offset: -1px;
}
${editorSelector} .EditorLineDecoration {
  color: var(--EditorInlineBlameForeground, rgba(255, 255, 255, 0.5));
  font-style: italic;
  margin-left: 2em;
  user-select: none;
}
${editorSelector} .LineNumber {
  contain: content;
  position: relative;
}
${editorSelector} .EditorGutterDecoration {
  bottom: 0;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 3px;
}
${editorSelector} .EditorGutterDecorationAdded {
  background: var(--EditorGutterAddedBackground, #2ea043);
}
${editorSelector} .EditorGutterDecorationModified {
  background: var(--EditorGutterModifiedBackground, #0078d4);
}
${editorSelector} .EditorGutterDecorationDeleted {
  background: var(--EditorGutterDeletedBackground, #f85149);
  height: 3px;
  top: calc(50% - 1px);
}
${editorSelector} .R{background-color:#add6ff40}
${editorSelector} .BracketMatch {
  position: absolute;
  box-sizing: border-box;
  border: 1px solid var(--EditorBracketMatchBorder, rgba(128, 128, 128, 0.8));
  background: var(--EditorBracketMatchBackground, rgba(128, 128, 128, 0.25));
  pointer-events: none;
}
${editorSelector} .ScrollBarThumbVertical {
  height: var(--ScrollBarHeight);
  translate: 0px var(--ScrollBarTop);
}
${editorSelector} .ScrollBarThumbHorizontal {
  width: var(--ScrollBarWidth);
  translate: var(--ScrollBarLeft) 0px;
}
`
}
