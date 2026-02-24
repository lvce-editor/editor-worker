const contents = Object.create(null)

contents['/test.txt'] = 'Hello World'

const fileSystemProvider = {
  id: 'xyz',
  writeFile(uri, content) {
    throw new TypeError('x is not a function')
  },
  rename(oldUri, newUri) {},
  readFile(uri) {
    return contents[uri]
  },
  pathSeparator: '/',
  readDirWithFileTypes(uri) {
    const results = []
    for (const [key, value] of Object.entries(contents)) {
      if (key.startsWith(uri)) {
        results.push({
          type: 7,
          name: key.slice(key.lastIndexOf('/')),
        })
      }
    }
    return results
  },
  remove(uri) {
    throw new Error(`oops`)
  },
}

export const activate = () => {
  vscode.registerFileSystemProvider(fileSystemProvider)
}
