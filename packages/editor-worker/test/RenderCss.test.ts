import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss', () => {
  const newState = {
    deltaX: 40,
    deltaY: 40,
    finalDeltaY: 80,
    height: 40,
    longestLineWidth: 160,
    minimumSliderSize: 24,
    rowHeight: 20,
    scrollBarHeight: 24,
    uid: 1,
    width: 80,
  }

  expect(renderCss({} as any, newState as any)).toEqual([
    ViewletCommand.SetCss,
    1,
    `.Editor[data-uid="1"] {
  --EditorRowHeight: 20px;
  --ScrollBarHeight: 24px;
  --ScrollBarTop: 8px;
  --ScrollBarWidth: 40px;
  --ScrollBarLeft: 20px;
}
.Editor[data-uid="1"] .EditorRow {
  height: var(--EditorRowHeight);
  line-height: var(--EditorRowHeight);
}
.Editor[data-uid="1"] .EditorLineDecoration {
  color: var(--EditorInlineBlameForeground, rgba(255, 255, 255, 0.5));
  font-style: italic;
  margin-left: 2em;
  user-select: none;
}
.Editor[data-uid="1"] .R{background-color:#add6ff40}
.Editor[data-uid="1"] .BracketMatch {
  position: absolute;
  box-sizing: border-box;
  border: 1px solid var(--EditorBracketMatchBorder, rgba(128, 128, 128, 0.8));
  background: var(--EditorBracketMatchBackground, rgba(128, 128, 128, 0.25));
  pointer-events: none;
}
.Editor[data-uid="1"] .ScrollBarThumbVertical {
  height: var(--ScrollBarHeight);
  translate: 0px var(--ScrollBarTop);
}
.Editor[data-uid="1"] .ScrollBarThumbHorizontal {
  width: var(--ScrollBarWidth);
  translate: var(--ScrollBarLeft) 0px;
}
`,
  ])
})
