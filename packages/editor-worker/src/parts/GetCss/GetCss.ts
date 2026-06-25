export const getCss = (rowHeight: number, scrollBarHeight: number, scrollBarTop: number, scrollBarWidth: number, scrollBarLeft: number): string => {
  return `.Editor {
  --EditorRowHeight: ${rowHeight}px;
  --ScrollBarHeight: ${scrollBarHeight}px;
  --ScrollBarTop: ${scrollBarTop}px;
  --ScrollBarWidth: ${scrollBarWidth}px;
  --ScrollBarLeft: ${scrollBarLeft}px;
}
.Editor .EditorRow {
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
.Editor .ScrollBarThumbVertical {
  height: var(--ScrollBarHeight);
  translate: 0px var(--ScrollBarTop);
}
.Editor .ScrollBarThumbHorizontal {
  width: var(--ScrollBarWidth);
  translate: var(--ScrollBarLeft) 0px;
}
`
}
