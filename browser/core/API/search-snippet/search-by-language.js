import _ from 'lodash'
import { getExtension } from 'lib/util'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'

function searchByLanguage (snippets, language) {
  if (language) {
    language = language.replace(/_/g, ' ')
    const languageRegex = new RegExp(_.escapeRegExp(language), 'i')
    snippets = snippets.filter(snippet => {
      if (snippet.files) {
        for (let i = 0; i < snippet.files.length; i++) {
          const file = snippet.files[i]
          const fileExtension = getExtension(file.name)
          const mode = CodeMirror.findModeByExtension(fileExtension)
          let langName = fileExtension ? fileExtension.toUpperCase() : 'unknown'
          if (mode) {
            langName = mode.name
          }
          if (langName.match(languageRegex)) {
            return true
          }
        }
        return false
      } else {
        return snippet.lang.match(languageRegex)
      }
    })
  }
  return snippets
}

module.exports = searchByLanguage
