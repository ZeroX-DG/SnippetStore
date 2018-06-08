import searchSnippet from 'core/API/search-snippet'

const sampleSnippets = [
  { name: 'javascript snippet', lang: 'JavaScript' },
  { name: 'random asd', lang: 'csharp' },
  { name: 'qwww', lang: 'APL' },
  { name: 'ojka', lang: 'html' }
]

describe('search snippet', () => {
  it('should remove all snippet with no matching name', () => {
    const filteredSnippet = searchSnippet(sampleSnippets, 'snippet')
    expect(filteredSnippet).toEqual([{ name: 'javascript snippet', lang: 'JavaScript' }])
  })

  it('should remove all snippet with no matching language', () => {
    const filteredSnippet = searchSnippet(sampleSnippets, 'lang:APL')
    expect(filteredSnippet).toEqual([{ name: 'qwww', lang: 'APL' }])
  })

  it('should remove all snippet with no matching name and language', () => {
    const filteredSnippet = searchSnippet(sampleSnippets, 'random lang:csharp')
    expect(filteredSnippet).toEqual([{ name: 'random asd', lang: 'csharp' }])
  })
})
