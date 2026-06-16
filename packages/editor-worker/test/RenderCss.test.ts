import { ViewletCommand } from '@lvce-editor/constants'
import { expect, test } from '@jest/globals'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss', () => {
  const newState = {
    deltaY: 40,
    finalDeltaY: 80,
    height: 40,
    rowHeight: 20,
    scrollBarHeight: 24,
    uid: 1,
  }

  expect(renderCss({} as any, newState as any)).toEqual([
    ViewletCommand.SetCss,
    1,
    `.Editor {
  --EditorRowHeight: 20px;
  --ScrollBarHeight: 24px;
  --ScrollBarTop: 8px;
}
.Editor .EditorRow {
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
.Editor .ScrollBarThumbVertical {
  height: var(--ScrollBarHeight);
  translate: 0px var(--ScrollBarTop);
}
`,
  ])
})
