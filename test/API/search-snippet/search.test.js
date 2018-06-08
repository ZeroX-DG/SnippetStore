import searchSnippet from 'core/API/search-snippet'

const sampleSnippets = [
  { name: 'javascript snippet', lang: 'JavaScript' },
  { name: 'random snippet', lang: 'csharp' },
  { name: 'qwww', lang: 'APL' },
  { name: 'ojka', lang: 'html' }
]

describe('search snippet', () => {
  it('should remove all snippet with no matching name', () => {
    const filteredSnippet = searchSnippet(sampleSnippets, 'snippet')
    expect(filteredSnippet.length).toBe(2)
  })

  it('should remove all snippet with no matching language', () => {
    const filteredSnippet = searchSnippet(sampleSnippets, 'lang:APL')
    expect(filteredSnippet.length).toBe(1)
  })

  it('should remove all snippet with no matching name and language', () => {
    const filteredSnippet = searchSnippet(sampleSnippets, 'snippet lang:csharp')
    expect(filteredSnippet.length).toBe(1)
  })
})
