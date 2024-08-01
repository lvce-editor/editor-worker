import { setup } from '../test-integration-util/setup.js'
import * as CreateEditor from './create-editor.test.js'
import * as EditorCopyLineDown from './editor-copy-line-down.test.js'
import * as FindWidget from './find-widget.test.js'

const tests = [CreateEditor, FindWidget, EditorCopyLineDown]

const runTests = async (tests) => {
  for (const module of tests) {
    const rpc = await setup()
    await module.test(rpc)
  }
}

const main = async () => {
<<<<<<< Updated upstream
  await runTests(tests)
=======
  console.time('editor')
  await CreateEditor.test()
  console.timeEnd('editor')
  console.time('find')
  await FindWidget.test()
  console.timeEnd('find')
>>>>>>> Stashed changes
  process.exit(0)
}

main()
