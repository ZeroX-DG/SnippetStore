import { observable, computed } from 'mobx'

class SnippetStore {
  @observable snippets = []
}

let store = window.store = new SnippetStore()

export default store
