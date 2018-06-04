import { generateKey } from 'lib/util'
import { SNIPPET_INFO_FILE } from '../config'
const sander = require('sander')

function createSnippet (snippet) {
  const key      = generateKey()
  const createAt = (new Date()).getTime()
  const updateAt = createAt
  const copy     = 0

  snippet = Object.assign({}, { key, createAt, updateAt, copy }, snippet)

  let snippets = []

  if (sander.existsSync(SNIPPET_INFO_FILE)) {
    snippets = JSON.parse(sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' }))
  }

  snippets.push(snippet)
  sander.writeFileSync(SNIPPET_INFO_FILE, JSON.stringify(snippets), { encoding: 'utf-8' })

  return snippet
}

module.exports = createSnippet
