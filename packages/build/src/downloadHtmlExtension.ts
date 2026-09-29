import { createHash } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { brotliDecompressSync } from 'node:zlib'
import { execa } from 'execa'
import { root } from './root.ts'

const version = '1.11.0'
const sha256 = 'e0bdc8285c86f942792e208384761e7d1539f303c2b9960e4389885012d0965a'

export const downloadHtmlExtension = async (): Promise<void> => {
  const destination = join(root, 'packages/e2e/fixtures/editor.auto-closing-tag/dist')
  const archivePath = join(root, '.tmp', `language-features-html-v${version}.tar.br`)
  let archive: Buffer
  try {
    archive = await readFile(archivePath)
  } catch {
    const response = await fetch(
      `https://github.com/lvce-editor/language-features-html/releases/download/v${version}/language-features-html-v${version}.tar.br`,
      { signal: AbortSignal.timeout(30_000) },
    )
    if (!response.ok) {
      throw new Error(`Failed to download HTML extension: ${response.status}`)
    }
    archive = Buffer.from(await response.arrayBuffer())
  }
  if (createHash('sha256').update(archive).digest('hex') !== sha256) {
    throw new Error('HTML extension checksum mismatch')
  }
  await writeFile(archivePath, archive)
  const tarPath = join(root, '.tmp', `language-features-html-v${version}.tar`)
  await writeFile(tarPath, brotliDecompressSync(archive))
  await rm(destination, { recursive: true, force: true })
  await mkdir(destination, { recursive: true })
  await execa('tar', ['-xf', tarPath, '-C', destination])
}
