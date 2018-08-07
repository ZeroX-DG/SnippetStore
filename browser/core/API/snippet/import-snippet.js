import fs from 'fs'
import fetchSnippets from './fetch-snippets'
import { SNIPPET_INFO_FILE } from '../config'
import { generateKey } from 'lib/utils'

function importSnippet (snippetFile) {
  try {
    const data = fs.readFileSync(snippetFile, { encoding: 'utf-8' })
    const snippet = JSON.parse(data)
    const snippets = fetchSnippets()

    while (snippets.some(s => s.key === snippet.key)) {
      snippet.key = generateKey()
    }

    snippets.push(snippet)
    fs.writeFileSync(SNIPPET_INFO_FILE, JSON.stringify(snippets), {
      encoding: 'utf-8'
    })
    return snippet
  } catch (error) {
    throw error
  }
}

module.exports = importSnippet
