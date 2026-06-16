export const getCss = (rowHeight: number, scrollBarHeight: number, scrollBarTop: number): string => {
  return `.Editor {
  --EditorRowHeight: ${rowHeight}px;
  --ScrollBarHeight: ${scrollBarHeight}px;
  --ScrollBarTop: ${scrollBarTop}px;
}
.Editor .EditorRow {
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
.Editor .ScrollBarThumbVertical {
  height: var(--ScrollBarHeight);
  translate: 0px var(--ScrollBarTop);
}
`
}
