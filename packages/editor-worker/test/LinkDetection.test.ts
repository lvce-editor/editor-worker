import { expect, test } from '@jest/globals'
import * as LinkDetection from '../src/parts/LinkDetection/LinkDetection.ts'

test('detects simple http URL', () => {
  const links = LinkDetection.detectLinks('Check out http://example.com for more')
  expect(links).toEqual([{ length: 18, start: 10 }])
})

test('detects https URL', () => {
  const links = LinkDetection.detectLinks('Visit https://github.com today')
  expect(links).toEqual([{ length: 18, start: 6 }])
})

test('detects ftp URL', () => {
  const links = LinkDetection.detectLinks('Download from ftp://files.example.com here')
  expect(links).toEqual([{ length: 23, start: 14 }])
})

test('detects URL with path', () => {
  const links = LinkDetection.detectLinks('See https://example.com/path/to/page')
  expect(links).toEqual([{ length: 32, start: 4 }])
})

test('detects URL with query string', () => {
  const links = LinkDetection.detectLinks('Visit https://example.com/search?q=test')
  expect(links).toEqual([{ length: 33, start: 6 }])
})

test('detects www URL without scheme', () => {
  const links = LinkDetection.detectLinks('Go to www.example.com for info')
  expect(links).toEqual([{ length: 15, start: 6 }])
})

test('detects multiple URLs', () => {
  const links = LinkDetection.detectLinks('Check https://example.com and http://test.org')
  expect(links).toEqual([
    { length: 19, start: 6 },
    { length: 15, start: 30 },
  ])
})

test('does not detect plain domain without www or scheme', () => {
  const links = LinkDetection.detectLinks('example.com is not a link')
  expect(links).toEqual([])
})

test('detects ftps URL', () => {
  const links = LinkDetection.detectLinks('Secure: ftps://secure.example.com/file')
  expect(links).toEqual([{ length: 30, start: 8 }])
})

test('handles URL at start of line', () => {
  const links = LinkDetection.detectLinks('https://example.com/page is interesting')
  expect(links).toEqual([{ length: 24, start: 0 }])
})

test('handles URL at end of line', () => {
  const links = LinkDetection.detectLinks('Visit my site at https://example.com')
  expect(links).toEqual([{ length: 19, start: 17 }])
})

test('detects no links in plain text', () => {
  const links = LinkDetection.detectLinks('This is just plain text with no links')
  expect(links).toEqual([])
})

test('handles empty string', () => {
  const links = LinkDetection.detectLinks('')
  expect(links).toEqual([])
})

test('detects URL with subdomain', () => {
  const links = LinkDetection.detectLinks('Check https://api.github.com/repos')
  expect(links).toEqual([{ length: 28, start: 6 }])
})

test('detects URL with hyphenated domain', () => {
  const links = LinkDetection.detectLinks('Visit https://my-awesome-site.com here')
  expect(links).toEqual([{ length: 27, start: 6 }])
})

test('detectAllLinksAsDecorations returns empty for editor with no links', () => {
  const editor = {
    lines: ['Hello world', 'This is plain text'],
  }
  const decorations = LinkDetection.detectAllLinksAsDecorations(editor)
  expect(decorations).toEqual([])
})

test('detectAllLinksAsDecorations finds links in editor', () => {
  const editor = {
    lines: ['Visit https://example.com', 'See http://test.org today'],
  }
  const decorations = LinkDetection.detectAllLinksAsDecorations(editor)
  // First line: link at offset 6, length 19
  // Second line: offset is (25 + 1) = 26, link starts at position 4, so offset 30, length 15
  expect(decorations).toEqual([
    6,
    19,
    1,
    0, // offset, length, DecorationType.Link, modifiers
    30,
    15,
    1,
    0,
  ])
})

test('detectAllLinksAsDecorations handles multiple links per line', () => {
  const editor = {
    lines: ['Check https://example.com and http://test.org'],
  }
  const decorations = LinkDetection.detectAllLinksAsDecorations(editor)
  expect(decorations).toEqual([
    6,
    19,
    1,
    0, // first link
    30,
    15,
    1,
    0, // second link
  ])
})

test('handles URL in JSON with trailing double quote', () => {
  const links = LinkDetection.detectLinks('"resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.28.6.tgz",')
  expect(links).toEqual([{ length: 68, start: 13 }])
  // The URL should not include the trailing quote
  const url = '"resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.28.6.tgz",'.slice(13, 13 + 68)
  expect(url).toBe('https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.28.6.tgz')
})

test('handles URL in JSON with trailing single quote', () => {
  const links = LinkDetection.detectLinks("'url': 'https://example.com/package-1.0.0.tar.gz',")
  expect(links).toEqual([{ length: 40, start: 8 }])
  const url = "'url': 'https://example.com/package-1.0.0.tar.gz',".slice(8, 8 + 40)
  expect(url).toBe('https://example.com/package-1.0.0.tar.gz')
})
