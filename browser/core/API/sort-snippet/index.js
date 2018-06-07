import sortByCreateTime from './sort-by-create-time'

function sortSnippet (snippets, type) {
  if (type === 'createTimeNewer' || type === 'createTimeOlder') {
    return sortByCreateTime(snippets, type)
  }
}

module.exports = sortSnippet
