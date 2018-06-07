import _ from 'lodash'

function searchByName (snippets, name) {
  if (name) {
    const nameRegex = new RegExp(_.escapeRegExp(name), 'i')
    snippets = snippets.filter(snippet => snippet.name.match(nameRegex))
  }
  return snippets
}

module.exports = searchByName
