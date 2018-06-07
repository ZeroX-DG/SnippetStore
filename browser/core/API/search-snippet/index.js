import searchByLanguage from './search-by-language'
import searchByName from './search-by-name'

function searchSnippet (snippets, keyword) {
  const searchParts = keyword.split(' ').filter(word => word !== '')
  let result = snippets
  const langRegex = /lang:(.*)/

  searchParts.forEach(search => {
    const language = langRegex.exec(search)
    if (language) {
      result = searchByLanguage(result, language[1])
    } else {
      result = searchByName(result, search)
    }
  })

  return result
}

module.exports = searchSnippet
