import { generateKey } from 'lib/util'
import fetchSnippets from './fetch-snippets'
import { SNIPPET_INFO_FILE } from '../config'
import _ from 'lodash'
const sander = require('sander')

function createSnippet (snippet) {
  const key = generateKey()
  const time = new Date().getTime()
  const createAt = time
  const updateAt = time
  const copy = 0
  const tags = []

  snippet = _.merge({ key, createAt, updateAt, copy, tags }, snippet)

  const snippets = fetchSnippets()

  snippets.push(snippet)
  sander.writeFileSync(SNIPPET_INFO_FILE, JSON.stringify(snippets), {
    encoding: 'utf-8'
  })

  return snippet
}

module.exports = createSnippet
