function sortByCreateTime (snippets, type) {
  return snippets.sort((a, b) => {
    return type === 'createTimeNewer' ? b.createAt - a.createAt : a.createAt - b.createAt
  })
}

module.exports = sortByCreateTime
