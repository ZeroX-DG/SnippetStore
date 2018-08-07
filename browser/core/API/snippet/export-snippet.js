import fs from 'fs'
import path from 'path'

function exportSnippet (snippet, folder) {
  const fullPath = path.join(folder, `${snippet.name || 'All snippets'}.json`)
  fs.writeFileSync(fullPath, JSON.stringify(snippet), { encoding: 'utf-8' })
}

module.exports = exportSnippet
