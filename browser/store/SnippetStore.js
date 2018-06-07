import { observable, computed } from 'mobx'
import SnippetAPI from 'core/API/snippet'
import searchSnippet from 'core/API/search'

class SnippetStore {
  @observable rawSnippets = []
  @observable filter = ''

  @computed get snippets () {
    return searchSnippet(this.rawSnippets, this.filter)
  }

  @computed get languages () {
    const languages = {}
    this.rawSnippets.forEach(snippet => {
      if (languages[snippet.lang]) {
        languages[snippet.lang] += 1
      } else {
        languages[snippet.lang] = 1
      }
    })
    return languages
  }

  loadSnippets (snippets) {
    this.rawSnippets = snippets
  }

  createSnippet (snippet) {
    const newSnippet = SnippetAPI.createSnippet(snippet)
    this.rawSnippets.push(newSnippet)
  }

  updateSnippet (snippet) {
    // update using the snippet API
    const snippetIndex = SnippetAPI.updateSnippet(snippet)
    this.rawSnippets[snippetIndex] = snippet
  }

  increaseCopyTime (snippet) {
    snippet.copy += 1
    this.updateSnippet(snippet)
  }

  deleteSnippet (snippet) {
    const snippetIndex = SnippetAPI.deleteSnippet(snippet)
    this.rawSnippets.splice(snippetIndex, 1)
  }
}

let store = window.store = new SnippetStore()

export default store
