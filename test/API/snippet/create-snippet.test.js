import SnippetAPI from 'core/API/snippet'
import { getSnippetFile } from 'core/API/config'
const sander = require('sander')
const SNIPPET_INFO_FILE = getSnippetFile()
describe('create snippet', () => {
  afterAll(() => {
    sander.rimraf(SNIPPET_INFO_FILE)
  })
  it('should return a snippet with some addition properties', () => {
    const snippet = SnippetAPI.createSnippet({
      name: 'snippet-test',
      lang: 'JavaScript',
      value: 'this is snippet value'
    })

    expect(snippet.name === 'snippet-test').toBe(true)
    expect(snippet.lang === 'JavaScript').toBe(true)
    expect(snippet.value === 'this is snippet value').toBe(true)
    expect(snippet.key === '').toBe(false)
    expect(typeof snippet.createAt).toBe('number')
    expect(typeof snippet.updateAt).toBe('number')
    expect(snippet.copy).toBe(0)
  })

  it('should push a snippet into info file', () => {
    const snippet = SnippetAPI.createSnippet({
      name: 'snippet-test',
      lang: 'JavaScript',
      value: 'this is snippet value'
    })
    const fileData = sander.readFileSync(SNIPPET_INFO_FILE, {
      encoding: 'utf-8'
    })
    const snippets = JSON.parse(fileData)
    expect(typeof snippets.find(fsnippet => fsnippet.key === snippet.key)).toBe(
      'object'
    )
  })
})
