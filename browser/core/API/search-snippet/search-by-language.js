import _ from 'lodash'

function searchByLanguage (snippets, language) {
  if (language) {
    const languageRegex = new RegExp(_.escapeRegExp(language), 'i')
    snippets = snippets.filter(snippet => snippet.lang.match(languageRegex))
  }
  return snippets
}

module.exports = searchByLanguage
