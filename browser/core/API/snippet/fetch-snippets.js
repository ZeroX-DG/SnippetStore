import { SNIPPET_INFO_FILE } from '../config'
const sander = require('sander')

function fetchSnippets () {
  if (!sander.existsSync(SNIPPET_INFO_FILE)) {
    sander.writeFileSync(SNIPPET_INFO_FILE, '[]')
    return []
  }
  const fileData = sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' })
  if (!fileData) {
    sander.writeFileSync(SNIPPET_INFO_FILE, '[]')
    return []
  }
  return JSON.parse(fileData)
}

module.exports = fetchSnippets
