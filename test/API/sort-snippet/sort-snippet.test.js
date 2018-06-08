import sortSnippet from 'core/API/sort-snippet'

const sampleSnippets = [
  { name: 'javascript snippet', createAt: 1528445123305, updateAt: 1528451681979, copy: 2 },
  { name: 'random asd', lang: 'csharp', createAt: 1528445127360, updateAt: 1528451686506, copy: 3 },
  { name: 'qwww', lang: 'APL', createAt: 1528445125473, updateAt: 1528451689817, copy : 0 },
  { name: 'ojka', lang: 'html', createAt: 1528445129147, updateAt: 1528451692668, copy: 10 }
]

//1528445123305 -> 1528445125473 -> 1528445127360 -> 1528445129147
//1528451681979 -> 1528451686506 -> 1528451689817 -> 1528451692668

describe('sort snippet', () => {
  it('should reorder all snippet with by create time (newest)', () => {
    const sortedSnippet = sortSnippet(sampleSnippets, 'createTimeNewer')
    expect(sortedSnippet).toEqual([
      { name: 'ojka', lang: 'html', createAt: 1528445129147, updateAt: 1528451692668, copy: 10 },
      { name: 'random asd', lang: 'csharp', createAt: 1528445127360, updateAt: 1528451686506, copy: 3 },
      { name: 'qwww', lang: 'APL', createAt: 1528445125473, updateAt: 1528451689817, copy : 0 },
      { name: 'javascript snippet', createAt: 1528445123305, updateAt: 1528451681979, copy: 2 }
    ])
  })

  it('should reorder all snippet with by create time (oldest)', () => {
    const sortedSnippet = sortSnippet(sampleSnippets, 'createTimeOlder')
    expect(sortedSnippet).toEqual([
      { name: 'javascript snippet', createAt: 1528445123305, updateAt: 1528451681979, copy: 2 },
      { name: 'qwww', lang: 'APL', createAt: 1528445125473, updateAt: 1528451689817, copy : 0 },
      { name: 'random asd', lang: 'csharp', createAt: 1528445127360, updateAt: 1528451686506, copy: 3 },
      { name: 'ojka', lang: 'html', createAt: 1528445129147, updateAt: 1528451692668, copy: 10 }
    ])
  })

  it('should reorder all snippet with by update time (newest)', () => {
    const sortedSnippet = sortSnippet(sampleSnippets, 'updateTimeNewer')
    expect(sortedSnippet).toEqual([
      { name: 'ojka', lang: 'html', createAt: 1528445129147, updateAt: 1528451692668, copy: 10 },
      { name: 'qwww', lang: 'APL', createAt: 1528445125473, updateAt: 1528451689817, copy : 0 },
      { name: 'random asd', lang: 'csharp', createAt: 1528445127360, updateAt: 1528451686506, copy: 3 },
      { name: 'javascript snippet', createAt: 1528445123305, updateAt: 1528451681979, copy: 2 }
    ])
  })

  it('should reorder all snippet with by update time (oldest)', () => {
    const sortedSnippet = sortSnippet(sampleSnippets, 'updateTimeOlder')
    expect(sortedSnippet).toEqual([
      { name: 'javascript snippet', createAt: 1528445123305, updateAt: 1528451681979, copy: 2 },
      { name: 'random asd', lang: 'csharp', createAt: 1528445127360, updateAt: 1528451686506, copy: 3 },
      { name: 'qwww', lang: 'APL', createAt: 1528445125473, updateAt: 1528451689817, copy : 0 },
      { name: 'ojka', lang: 'html', createAt: 1528445129147, updateAt: 1528451692668, copy: 10 }
    ])
  })

  it('should reorder all snippet with by copy count (ascending)', () => {
    const sortedSnippet = sortSnippet(sampleSnippets, 'copyCountAsc')
    expect(sortedSnippet).toEqual([
      { name: 'qwww', lang: 'APL', createAt: 1528445125473, updateAt: 1528451689817, copy : 0 },
      { name: 'javascript snippet', createAt: 1528445123305, updateAt: 1528451681979, copy: 2 },
      { name: 'random asd', lang: 'csharp', createAt: 1528445127360, updateAt: 1528451686506, copy: 3 },
      { name: 'ojka', lang: 'html', createAt: 1528445129147, updateAt: 1528451692668, copy: 10 }
    ])
  })
})
