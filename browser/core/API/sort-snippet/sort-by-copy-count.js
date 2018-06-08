function sortByCopyCount (snippets, type) {
  return snippets.sort((a, b) => {
    return type === 'copyCountAsc' ? a.copy - b.copy : b.copy - a.copy
  })
}

module.exports = sortByCopyCount
