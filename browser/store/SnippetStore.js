import { observable, computed, toJS } from 'mobx'
import SnippetAPI from 'core/API/snippet'
import searchSnippet from 'core/API/search-snippet'
import sortSnippet from 'core/API/sort-snippet'
import eventEmitter from 'lib/event-emitter'
import { toast } from 'react-toastify'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'

class SnippetStore {
  @observable rawSnippets = []
  @observable filter = ''
  @observable sort = 'createTimeNewer'
  @observable selectedSnippet = null

  constructor () {
    eventEmitter.on('snippet:import', (event, snippetFile) => {
      this.importSnippet(snippetFile)
    })
    eventEmitter.on('snippet:exportAll', (event, folder) => {
      this.exportAllSnippet(folder)
    })
  }

  @computed
  get snippets () {
    const snippets = searchSnippet(this.rawSnippets, this.filter)
    return sortSnippet(snippets, this.sort)
  }

  @computed
  get languages () {
    const languages = {}
    this.rawSnippets.forEach(snippet => {
      if (snippet.files !== undefined) {
        snippet.files.forEach(file => {
          const ExtensionIndex = file.name.lastIndexOf('.') + 1
          const fileExtension =
            ExtensionIndex >= 2 ? file.name.substring(ExtensionIndex) : ''
          const mode = CodeMirror.findModeByExtension(fileExtension)
          let langName = fileExtension ? fileExtension.toUpperCase() : 'unknown'
          if (mode) {
            langName = mode.name
          }
          if (languages[langName]) {
            languages[langName] += 1
          } else {
            languages[langName] = 1
          }
        })
      } else {
        if (languages[snippet.lang]) {
          languages[snippet.lang] += 1
        } else {
          languages[snippet.lang] = 1
        }
      }
    })
    return languages
  }

  @computed
  get tags () {
    const tags = {}
    this.rawSnippets.forEach(snippet => {
      snippet.tags.filter(tag => tag).forEach(tag => {
        if (tags[tag]) {
          tags[tag] += 1
        } else {
          tags[tag] = 1
        }
      })
    })
    return tags
  }

  @computed
  get tagNames () {
    const tags = []
    this.rawSnippets.forEach(snippet => {
      snippet.tags.filter(tag => tag).forEach(tag => {
        if (tags.indexOf(tag) === -1) {
          tags.push(tag)
        }
      })
    })
    return tags
  }

  loadSnippets (snippets) {
    this.rawSnippets = snippets
  }

  createSnippet (snippet) {
    const newSnippet = SnippetAPI.createSnippet(snippet)
    this.rawSnippets.push(newSnippet)
  }

  importSnippet (snippetFile) {
    const newSnippetOrSnippetList = SnippetAPI.importSnippet(snippetFile)
    if (Array.isArray(newSnippetOrSnippetList)) {
      const newSnippetList = newSnippetOrSnippetList
      this.rawSnippets = newSnippetList
    } else {
      const newSnippet = newSnippetOrSnippetList
      this.rawSnippets.push(newSnippet)
    }
    toast.success('Snippet imported!')
  }

  exportAllSnippet (folder) {
    const allSnippets = toJS(this.rawSnippets)
    SnippetAPI.exportSnippet(allSnippets, folder)
    toast.success('All snippets exported!')
  }

  updateSnippet (snippet) {
    // update using the snippet API
    const snippetIndex = SnippetAPI.updateSnippet(snippet)
    this.rawSnippets[snippetIndex] = snippet
    this.selectedSnippet = snippet
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

const store = (window.store = new SnippetStore())

export default store
