function sortByCopyCount (snippets, type) {
  return snippets.sort((a, b) => {
    return type === 'copyCountAsc' ? b.createAt - a.createAt : a.createAt - b.createAt
  })
}

module.exports = sortByCopyCount
