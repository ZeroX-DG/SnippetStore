import { generateKey } from 'lib/util'
import { SNIPPET_INFO_FILE } from '../config'
import _ from 'lodash'
const sander = require('sander')

function createSnippet (snippet) {
  const key = generateKey()
  const time = (new Date()).getTime()
  const createAt = time
  const updateAt = time
  const copy = 0

  snippet = _.merge({ key, createAt, updateAt, copy }, snippet)

  let snippets = []

  if (sander.existsSync(SNIPPET_INFO_FILE)) {
    const fileData = sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' })
    snippets = JSON.parse(fileData)
  }

  snippets.push(snippet)
  sander.writeFileSync(SNIPPET_INFO_FILE, JSON.stringify(snippets), { encoding: 'utf-8' })

  return snippet
}

module.exports = createSnippet
