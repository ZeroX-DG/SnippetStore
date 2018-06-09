import SnippetAPI from 'core/API/snippet'
import { SNIPPET_INFO_FILE } from 'core/API/config'
const sander = require('sander')

describe('fetch snippet', () => {
  afterAll(() => {
    sander.rimraf(SNIPPET_INFO_FILE)
  })
  beforeEach(() => {
    sander.rimraf(SNIPPET_INFO_FILE)
  })

  it('should return an empty array if no snippets exists', () => {
    const snippets = SnippetAPI.fetchSnippets()
    expect(Array.isArray(snippets)).toBe(true)
    expect(snippets.length).toBe(0)
  })

  it('should return an array with the created snippet', () => {
    const snippet = SnippetAPI.createSnippet({
      name: 'snippet-test',
      lang: 'JavaScript',
      value: 'this is snippet value'
    })
    const snippets = SnippetAPI.fetchSnippets()
    expect(Array.isArray(snippets)).toBe(true)
    expect(snippets.length).toBe(1)
    expect(snippets[0]).toEqual(snippet)
  })
})
