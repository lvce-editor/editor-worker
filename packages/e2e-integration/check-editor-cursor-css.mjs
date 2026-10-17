import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const applicationPath = process.argv[2]
if (!applicationPath) {
  throw new Error('Pass the path to the LVCE application checkout')
}

const css = await readFile(join(applicationPath, 'static/css/parts/ViewletEditor.css'), 'utf8')
const cursorRule = css.match(/\.EditorCursor\s*\{([^}]+)\}/)?.[1]
if (!cursorRule || !/height:\s*var\(--EditorRowHeight,\s*var\(--EditorLineHeight\)\);/.test(cursorRule)) {
  throw new Error('Editor cursor height must use the effective editor row height')
}
