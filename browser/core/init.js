import { fetchSnippets } from './API/snippet'
import SnippetStore from 'store/SnippetStore'

function init () {
  const snippets = fetchSnippets()
  SnippetStore.loadSnippets(snippets)
}

export default init
