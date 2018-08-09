import SnippetAPI from 'core/API/snippet'
import { getSnippetFile } from 'core/API/config'
const sander = require('sander')
const SNIPPET_INFO_FILE = getSnippetFile()
describe('update snippet', () => {
  afterAll(() => {
    sander.rimraf(SNIPPET_INFO_FILE)
  })
  it('should return index of updated snippet in array and updated snippet property in info file', () => {
    const snippet = SnippetAPI.createSnippet({
      name: 'snippet-test',
      lang: 'JavaScript',
      value: 'this is snippet value'
    })

    snippet.name = 'updated-name'
    const updatedIndex = SnippetAPI.updateSnippet(snippet)
    const snippets = JSON.parse(
      sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' })
    )

    expect(typeof updatedIndex).toBe('number')
    expect(
      typeof snippets.find(fsnippet => fsnippet.name === 'updated-name')
    ).toBe('object')
  })
})
