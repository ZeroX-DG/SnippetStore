import { getSnippetFile } from '../config'
const sander = require('sander')

function fetchSnippets () {
  const SNIPPET_INFO_FILE = getSnippetFile()
  if (!sander.existsSync(SNIPPET_INFO_FILE)) {
    sander.writeFileSync(SNIPPET_INFO_FILE, '[]')
    return []
  }
  const fileData = sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' })
  if (!fileData) {
    sander.writeFileSync(SNIPPET_INFO_FILE, '[]')
    return []
  }
  // additional properties for later updates
  const additionalProperties = {
    copy: 0,
    tags: []
  }
  let snippets = JSON.parse(fileData)
  snippets = snippets.map(snippet =>
    Object.assign({}, additionalProperties, snippet)
  )
  return snippets
}

module.exports = fetchSnippets
