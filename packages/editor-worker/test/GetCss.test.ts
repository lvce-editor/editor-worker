import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss', () => {
  expect(getCss(42, 20, 24, 8, 40, 20)).toBe(`.Editor[data-uid="42"] {
  --EditorRowHeight: 20px;
  --ScrollBarHeight: 24px;
  --ScrollBarTop: 8px;
  --ScrollBarWidth: 40px;
  --ScrollBarLeft: 20px;
}
.Editor[data-uid="42"] .EditorRow {
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
.Editor[data-uid="42"] .ScrollBarThumbVertical {
  height: var(--ScrollBarHeight);
  translate: 0px var(--ScrollBarTop);
}
.Editor[data-uid="42"] .ScrollBarThumbHorizontal {
  width: var(--ScrollBarWidth);
  translate: var(--ScrollBarLeft) 0px;
}
`)
})
