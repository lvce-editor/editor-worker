import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss', () => {
  expect(getCss(20, 24, 8, 40, 20)).toBe(`.Editor {
  --EditorRowHeight: 20px;
  --ScrollBarHeight: 24px;
  --ScrollBarTop: 8px;
  --ScrollBarWidth: 40px;
  --ScrollBarLeft: 20px;
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
`)
})
