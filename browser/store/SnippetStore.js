import { observable, computed } from 'mobx'
import SnippetAPI from 'core/API/snippet'

class SnippetStore {
  @observable raw_snippets = []

  @computed get snippets () {
    return this.raw_snippets
  }

  @computed get languages () {
    const languages = {}
    this.raw_snippets.forEach(snippet => {
      if (languages[snippet.lang]) {
        languages[snippet.lang] += 1
      } else {
        languages[snippet.lang] = 1
      }
    })
    return languages
  }

  loadSnippets (snippets) {
    this.raw_snippets = snippets
  }

  createSnippet (snippet) {
    const newSnippet = SnippetAPI.createSnippet(snippet)
    this.raw_snippets.push(newSnippet)
  }
  
  updateSnippet (snippet) {
    // update using the snippet API
    const snippetIndex = SnippetAPI.updateSnippet(snippet)
    this.raw_snippets[snippetIndex] = snippet
  }

  increaseCopyTime (snippet) {
    snippet.copy += 1
    this.updateSnippet(snippet)
  }

  deleteSnippet (snippet) {
    const snippetIndex = SnippetAPI.deleteSnippet(snippet)
    this.raw_snippets.splice(snippetIndex, 1)
  }
}

let store = window.store = new SnippetStore()

export default store
