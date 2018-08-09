import fs from 'fs'
import fetchSnippets from './fetch-snippets'
import { getSnippetFile } from '../config'
import { generateKey } from 'lib/util'

function importSnippet (snippetFile) {
  try {
    const data = fs.readFileSync(snippetFile, { encoding: 'utf-8' })
    const snippetOrListOfSnippets = JSON.parse(data)
    let snippets = fetchSnippets()
    let snippet = null

    if (Array.isArray(snippetOrListOfSnippets)) {
      snippets = snippets.concat(snippetOrListOfSnippets)
    } else {
      snippet = snippetOrListOfSnippets
      while (snippets.some(s => s.key === snippet.key)) {
        snippet.key = generateKey()
      }
      snippets.push(snippet)
    }
    fs.writeFileSync(getSnippetFile(), JSON.stringify(snippets), {
      encoding: 'utf-8'
    })
    return snippet || snippets
  } catch (error) {
    throw error
  }
}

module.exports = importSnippet
