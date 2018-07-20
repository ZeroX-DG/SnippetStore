import React from 'react'
import CodeMirror from 'codemirror'
import { getExtension } from 'lib/util'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'

export default class CodeEditor extends React.Component {
  componentDidMount () {
    const { type } = this.props
    if (type === 'single') {
      this.initSingleFileSnippetEditor()
    } else {
      this.initMultiFileSnippetEditor()
    }
  }

  initSingleFileSnippetEditor () {
    const { config, snippet } = this.props
    if (snippet) {
      const { theme, showLineNumber, highlightCurrentLine } = config.editor
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
        autoRefresh: true
      })
      if (highlightCurrentLine) {
        this.editor.setOption('styleActiveLine', { nonEmpty: false })
      } else {
        this.editor.setOption('styleActiveLine', null)
      }
      this.editor.setSize('100%', 'auto')
      this.applyEditorStyleSingleFile()
    }
  }

  initMultiFileSnippetEditor () {
    const {
      snippet,
      config,
      handleEditingFileValueChange,
      selectedFile
    } = this.props
    const {
      theme,
      showLineNumber,
      tabSize,
      indentUsingTab,
      highlightCurrentLine
    } = config.editor
    const file = snippet.files[selectedFile]
    const fileExtension = getExtension(file.name)
    const resultMode = CodeMirror.findModeByExtension(fileExtension)
    let snippetMode = 'null'
    if (resultMode) {
      snippetMode = resultMode.mode
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    }

    const gutters = showLineNumber
      ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      : []

    this.editor = CodeMirror(this.refs.editor, {
      lineNumbers: showLineNumber,
      value: file.value,
      foldGutter: showLineNumber,
      mode: snippetMode,
      theme: theme,
      gutters: gutters,
      readOnly: true,
      autoCloseBrackets: true,
      autoRefresh: true
    })

    if (highlightCurrentLine) {
      this.editor.setOption('styleActiveLine', { nonEmpty: false })
    } else {
      this.editor.setOption('styleActiveLine', null)
    }
    this.editor.setOption('indentUnit', tabSize)
    this.editor.setOption('tabSize', tabSize)
    this.editor.setOption('indentWithTabs', indentUsingTab)
    this.editor.setSize('100%', 'auto')
    this.editor.on('change', () => {
      handleEditingFileValueChange()
    })
    this.applyEditorStyleMultiFile()
  }

  componentWillUpdate (props) {
    if (this.props.type === 'single') {
      this.onUpdateSingleFileSnippet(props)
    }
  }

  componentDidUpdate () {
    if (this.props.type === 'multi') {
      this.onUpdateMultiFileSnippet()
    }
  }

  onUpdateSingleFileSnippet (props) {
    const { snippet } = props
    const snippetMode = CodeMirror.findModeByName(snippet.lang).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    this.editor.setValue(snippet.value)
    this.editor.setOption('mode', snippetMode)
  }

  onUpdateMultiFileSnippet () {
    const { snippet, selectedFile, isEditing } = this.props

    if (!isEditing) {
      const file = snippet.files[selectedFile]
      if (file) {
        const fileExtension = getExtension(file.name)
        const resultMode = CodeMirror.findModeByExtension(fileExtension)
        let snippetMode = 'null'
        if (resultMode) {
          snippetMode = resultMode.mode
          require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        }

        this.editor.setOption('mode', snippetMode)
        this.editor.setValue(file.value)
      }
    }
  }

  applyEditorStyleSingleFile (props) {
    const { config, snippet } = props || this.props
    const {
      theme,
      showLineNumber,
      fontFamily,
      fontSize,
      tabSize,
      indentUsingTab,
      highlightCurrentLine
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

    if (highlightCurrentLine) {
      this.editor.setOption('styleActiveLine', { nonEmpty: false })
    } else {
      this.editor.setOption('styleActiveLine', null)
    }

    const wrapperElement = this.editor.getWrapperElement()
    wrapperElement.style.fontFamily = fontFamily
    if (this.props.maxHeight) {
      const wrapperElement = this.editor.getWrapperElement()
      wrapperElement.querySelector(
        '.CodeMirror-scroll'
      ).style.maxHeight = this.props.maxHeight
    }
    this.editor.refresh()
  }

  applyEditorStyleMultiFile (props) {
    const { snippet, config, selectedFile, isEditing, editingFiles } =
      props || this.props
    const {
      theme,
      showLineNumber,
      fontFamily,
      fontSize,
      tabSize,
      indentUsingTab,
      highlightCurrentLine
    } = config.editor
    const gutters = showLineNumber
      ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      : []
    const files = isEditing ? editingFiles : snippet.files
    const file = files[selectedFile]
    if (file) {
      const fileExtension = getExtension(file.name)
      const resultMode = CodeMirror.findModeByExtension(fileExtension)
      let snippetMode = 'null'
      if (resultMode) {
        snippetMode = resultMode.mode
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
      }
    }

    if (highlightCurrentLine) {
      this.editor.setOption('styleActiveLine', { nonEmpty: false })
    } else {
      this.editor.setOption('styleActiveLine', null)
    }

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
    if (this.props.maxHeight) {
      const wrapperElement = this.editor.getWrapperElement()
      wrapperElement.querySelector(
        '.CodeMirror-scroll'
      ).style.maxHeight = this.props.maxHeight
    }
    this.editor.refresh()
  }

  componentWillReceiveProps (props) {
    if (this.props.type === 'single') {
      this.applyEditorStyleSingleFile(props)
    } else {
      this.applyEditorStyleMultiFile(props)
    }
  }

  applyEditorStyle () {
    if (this.props.style === 'single') {
      this.applyEditorStyleSingleFile()
    } else {
      this.applyEditorStyleMultiFile()
    }
  }

  getValue () {
    return this.editor.getValue()
  }

  setValue (value) {
    return this.editor.setValue(value)
  }

  setOption (option, value) {
    this.editor.setOption(option, value)
  }

  render () {
    return <div className="code" ref="editor" />
  }
}
