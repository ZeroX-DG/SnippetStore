import { findIndexObject } from 'lib/util'
import { SNIPPET_INFO_FILE } from '../config'
const sander = require('sander')

function updateSnippet (snippet) {
  let snippets = []

  if (sander.existsSync(SNIPPET_INFO_FILE)) {
    snippets = JSON.parse(sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' }))
  }

  const snippetIndex = findIndexObject(snippets, 'key', snippet.key)

  if (snippetIndex === -1) {
    throw new Error(`Can\'t find a snippet with key: ${snippets.key}`)
    return
  }

  snippets[snippetIndex] = snippet
  sander.writeFileSync(SNIPPET_INFO_FILE, JSON.stringify(snippets), { encoding: 'utf-8' })

  return snippetIndex
}

module.exports = updateSnippet
