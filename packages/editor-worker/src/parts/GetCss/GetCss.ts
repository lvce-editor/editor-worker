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
${editorSelector} .Token.EditorRenameHighlight {
  background-color: var(--EditorRenameHighlightBackground, rgba(173, 214, 255, 0.25));
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
