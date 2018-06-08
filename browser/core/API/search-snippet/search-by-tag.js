import _ from 'lodash'

function searchByTag (snippets, tag) {
  if (tag) {
    const tagRegex = new RegExp(_.escapeRegExp(tag[1]), 'i')
    snippets = snippets.filter(
      snippet => snippet.tags.some(ftag => ftag.match(tagRegex)))
  }
  return snippets
}

module.exports = searchByTag
