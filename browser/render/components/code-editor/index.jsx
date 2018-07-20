import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'

export default class CodeEditor extends React.Component {
  componentDidMount () {
    const { config, snippet } = this.props
    if (snippet) {
      const { theme, showLineNumber } = config.editor
      const snippetMode = CodeMirror.findModeByName(snippet.lang).mode
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
      const gutters = showLineNumber
        ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        : []
      this.editor = CodeMirror(this.refs.editor, {
        lineNumbers: showLineNumber,
        value: snippet.value,
        foldGutter: showLineNumber,
        mode: snippetMode,
        theme: theme,
        gutters: gutters,
        readOnly: true,
        autoCloseBrackets: true,
        autoRefresh: true,
        styleActiveLine: { nonEmpty: false }
      })
      this.editor.setSize('100%', 'auto')
      this.applyEditorStyle()
    }
  }

  componentWillUpdate (props) {
    const { snippet } = props
    const snippetMode = CodeMirror.findModeByName(snippet.lang).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    this.editor.setValue(snippet.value)
    this.editor.setOption('mode', snippetMode)
  }

  applyEditorStyle (props) {
    const { config, snippet } = props || this.props
    const {
      theme,
      showLineNumber,
      fontFamily,
      fontSize,
      tabSize,
      indentUsingTab
    } = config.editor
    // only update codemirror mode if new props is passed
    if (props) {
      const snippetMode = CodeMirror.findModeByName(snippet.lang).mode
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    }
    const gutters = showLineNumber
      ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      : []
    this.editor.getWrapperElement().style.fontSize = `${fontSize}px`
    this.editor.setOption('lineNumbers', showLineNumber)
    this.editor.setOption('foldGutter', showLineNumber)
    this.editor.setOption('theme', theme)
    this.editor.setOption('gutters', gutters)

    this.editor.setOption('indentUnit', tabSize)
    this.editor.setOption('tabSize', tabSize)
    this.editor.setOption('indentWithTabs', indentUsingTab)

    const wrapperElement = this.editor.getWrapperElement()
    wrapperElement.style.fontFamily = fontFamily
    this.editor.refresh()
  }

  componentWillReceiveProps (props) {
    this.applyEditorStyle(props)
  }

  getValue () {
    return this.editor.getValue()
  }

  setOption (option, value) {
    this.editor.setOption(option, value)
  }

  render () {
    return <div className="code" ref="editor" />
  }
}
