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
.Editor[data-uid="42"] .EditorLineDecoration {
  color: var(--EditorInlineBlameForeground, rgba(255, 255, 255, 0.5));
  font-style: italic;
  margin-left: 2em;
  user-select: none;
}
.Editor[data-uid="42"] .LineNumber {
  position: relative;
}
.Editor[data-uid="42"] .EditorGutterDecoration {
  bottom: 0;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 3px;
}
.Editor[data-uid="42"] .EditorGutterDecorationAdded {
  background: var(--EditorGutterAddedBackground, #2ea043);
}
.Editor[data-uid="42"] .EditorGutterDecorationModified {
  background: var(--EditorGutterModifiedBackground, #0078d4);
}
.Editor[data-uid="42"] .EditorGutterDecorationDeleted {
  background: var(--EditorGutterDeletedBackground, #f85149);
  height: 3px;
  top: calc(50% - 1px);
}
.Editor[data-uid="42"] .R{background-color:#add6ff40}
.Editor[data-uid="42"] .BracketMatch {
  position: absolute;
  box-sizing: border-box;
  border: 1px solid var(--EditorBracketMatchBorder, rgba(128, 128, 128, 0.8));
  background: var(--EditorBracketMatchBackground, rgba(128, 128, 128, 0.25));
  pointer-events: none;
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
