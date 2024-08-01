import { setup } from '../test-integration-util/setup.js'
import * as CreateEditor from './create-editor.test.js'
import * as EditorCopyLineDown from './editor-copy-line-down.test.js'
import * as FindWidget from './find-widget.test.js'

const tests = [
  // CreateEditor, FindWidget,
  EditorCopyLineDown,
]

const runTests = async (tests) => {
  for (const module of tests) {
    const rpc = await setup()
    await module.test(rpc)
  }
}

const main = async () => {
  await runTests(tests)
  process.exit(0)
}

main()
