export const getCss = (
  uid: number,
  rowHeight: number,
  scrollBarHeight: number,
  scrollBarTop: number,
  scrollBarWidth: number,
  scrollBarLeft: number,
): string => {
  const editorSelector = `.Editor[data-uid="${uid}"]`
  return `${editorSelector} {
  --EditorRowHeight: ${rowHeight}px;
  --ScrollBarHeight: ${scrollBarHeight}px;
  --ScrollBarTop: ${scrollBarTop}px;
  --ScrollBarWidth: ${scrollBarWidth}px;
  --ScrollBarLeft: ${scrollBarLeft}px;
}
${editorSelector} .EditorRow {
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
${editorSelector} .MergeConflictActions,
${editorSelector} .MergeConflictActionsGutter {
  box-sizing: border-box;
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
${editorSelector} .EditorLineDecoration {
  color: var(--EditorInlineBlameForeground, rgba(255, 255, 255, 0.5));
  font-style: italic;
  margin-left: 2em;
  user-select: none;
}
${editorSelector} .LineNumber {
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
