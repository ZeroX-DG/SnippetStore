import fs from 'fs'
import fetchSnippets from './fetch-snippets'
import { SNIPPET_INFO_FILE } from '../config'

function importSnippet (snippetFile) {
  try {
    const data = fs.readFileSync(snippetFile, { encoding: 'utf-8' })
    const snippet = JSON.parse(data)
    const snippets = fetchSnippets()

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
