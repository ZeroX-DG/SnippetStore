import _ from 'lodash'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'

function searchByLanguage (snippets, language) {
  if (language) {
    const languageRegex = new RegExp(_.escapeRegExp(language), 'i')
    snippets = snippets.filter(snippet => {
      if (snippet.files) {
        for (let i = 0; i < snippet.files.length; i++) {
          const file = snippet.files[i]
          const ExtensionIndex = file.name.lastIndexOf('.') + 1
          const fileExtension = file.name.substring(ExtensionIndex)
          const mode = CodeMirror.findModeByExtension(fileExtension)
          let langName = fileExtension
            ? fileExtension.toUpperCase()
            : 'unknown'
          if (mode) {
            langName = mode.name
          }
          return langName.match(languageRegex)
        }
      } else {
        return snippet.lang.match(languageRegex)
      }
    })
  }
  return snippets
}

module.exports = searchByLanguage
