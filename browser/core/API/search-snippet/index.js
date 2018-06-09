import searchByLanguage from './search-by-language'
import searchByName from './search-by-name'
import searchByTag from './search-by-tag'

function searchSnippet (snippets, keyword) {
  const searchParts = keyword.split(' ').filter(word => word !== '')
  let result = snippets
  const langRegex = /lang:(.*)/
  const tagRegex = /#(.*)/

  searchParts.forEach(search => {
    const language = langRegex.exec(search)
    const tag = tagRegex.exec(search)
    if (language) {
      result = searchByLanguage(result, language[1])
    } else if (tag) {
      result = searchByTag(result, tag)
    } else {
      result = searchByName(result, search)
    }
  })

  return result
}

module.exports = searchSnippet
