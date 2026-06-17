import { readFile, writeFile } from 'node:fs/promises'
import { minify } from 'terser'

export const minifyJs = async (inputPath: string, outputPath: string): Promise<void> => {
  const code = await readFile(inputPath, 'utf8')
  const output = await minify(code, {
    compress: false,
    format: {
      comments: false,
    },
    mangle: true,
    module: true,
    toplevel: true,
  })
  if (!output.code) {
    throw new Error('Failed to minify javascript')
  }
  await writeFile(outputPath, output.code)
}
