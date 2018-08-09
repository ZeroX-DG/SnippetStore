import fs from 'fs'
import { getSnippetFile } from '../config'

function migrateSnippet (oldLocation) {
  try {
    const snippets = JSON.parse(fs.readFileSync(oldLocation))
    fs.writeFileSync(getSnippetFile(), JSON.stringify(snippets), {
      encoding: 'utf-8'
    })
  } catch (error) {
    throw error
  }
}

module.exports = migrateSnippet
