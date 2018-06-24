function sortByUpdateTime (snippets, type) {
  return snippets.sort((a, b) => {
    return type === 'updateTimeNewer'
      ? b.updateAt - a.updateAt
      : a.updateAt - b.updateAt
  })
}

module.exports = sortByUpdateTime
