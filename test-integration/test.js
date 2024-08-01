import * as CreateEditor from './create-editor.test.js'
import * as FindWidget from './find-widget.test.js'

const main = async () => {
  await CreateEditor.test()
  await FindWidget.test()
  process.exit(0)
}

main()
