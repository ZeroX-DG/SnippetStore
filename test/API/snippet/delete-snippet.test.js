import SnippetAPI from 'core/API/snippet'
import { SNIPPET_INFO_FILE } from 'core/API/config'
const sander = require('sander')

describe('delete snippet', () => {
  afterAll(() => {
    sander.rimraf(SNIPPET_INFO_FILE)
  })
  beforeEach(() => {
    sander.rimraf(SNIPPET_INFO_FILE)
  })
  it('should return index of delete snippet in array and decrease array length in info file', () => {
    const snippet = SnippetAPI.createSnippet({
      name: 'snippet-test',
      lang: 'JavaScript',
      value: 'this is snippet value'
    })

    const snippets = JSON.parse(sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' }))
    const snippetsLength = snippets.length
    const deletedIndex = SnippetAPI.deleteSnippet(snippet)
    const newSnippets = JSON.parse(sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' }))
    expect(typeof deletedIndex).toBe('number')
    expect(newSnippets.length < snippetsLength).toBe(true)
  })
})
