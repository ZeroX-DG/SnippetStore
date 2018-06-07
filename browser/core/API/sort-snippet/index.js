import sortByCreateTime from './sort-by-create-time'
import sortByUpdateTime from './sort-by-update-time'
import sortByCopyCount from './sort-by-copy-count'

function sortSnippet (snippets, type) {
  if (type === 'createTimeNewer' || type === 'createTimeOlder') {
    return sortByCreateTime(snippets, type)
  } else if (type === 'updateTimeNewer' || type === 'updateTimeOlder') {
    return sortByUpdateTime(snippets, type)
  } else {
    return sortByCopyCount(snippets, type)
  }
}

module.exports = sortSnippet
