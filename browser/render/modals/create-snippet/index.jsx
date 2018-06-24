import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import eventEmitter from 'lib/event-emitter'
import i18n from 'render/lib/i18n'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'

export default class CreateSnippetModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: '',
      name: 'createSnippetModal'
    }
  }

  componentDidMount () {
    this.editor = CodeMirror(this.refs.editor, {
      autoRefresh: true
    })

    this.editor.setSize('100%', '100%')
    this.applyEditorStyle()
  }

  applyEditorStyle (props) {
    const { config } = props || this.props
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
      const snippetMode = CodeMirror.findModeByName(this.refs.lang.value).mode
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
    wrapperElement.querySelector('.CodeMirror-scroll').style.maxHeight = '200px'
    this.editor.refresh()
  }

  componentWillReceiveProps (props) {
    this.applyEditorStyle(props)
  }

  changeLang () {
    const snippetLang = this.refs.lang.value
    const snippetMode = CodeMirror.findModeByName(snippetLang).mode
    if (snippetMode === 'htmlmixed') {
      require(`codemirror/mode/xml/xml`)
      this.editor.setOption('mode', 'xml')
      this.editor.setOption('htmlMode', true)
    } else if (snippetMode === 'sql') {
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
      this.editor.setOption('mode', 'text/x-sql')
    } else {
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
      this.editor.setOption('mode', snippetMode)
    }
  }

  createSnippet () {
    const snippetName = this.refs.snippetName.value
    const snippetLang = this.refs.lang.value
    const snippetCode = this.editor.getValue()
    const snippetDescription = this.refs.description.value

    if (!snippetName || !snippetLang) {
      this.setState({
        error: 'Please specify at least snippet name and language'
      })
      return
    }

    this.props.store.createSnippet({
      name: snippetName,
      lang: snippetLang,
      value: snippetCode,
      description: snippetDescription
    })
    eventEmitter.emit('modal:close')
  }

  render () {
    i18n.setLocale(this.props.config.ui.language)
    return (
      <ModalSkeleton name={this.state.name}>
        <h2 className="modal-title">{i18n.__('Create snippet')}</h2>
        <div className="modal-content">
          <p className="error">{this.state.error}</p>
          <div className="input-group">
            <label>{i18n.__('Snippet name')}</label>
            <input type="text" ref="snippetName" />
          </div>
          <div className="input-group">
            <label>{i18n.__('Snippet language')}</label>
            <select ref="lang" onChange={this.changeLang.bind(this)}>
              {CodeMirror.modeInfo.map((mode, index) => (
                <option value={mode.name} key={index}>
                  {mode.name}
                </option>
              ))}
            </select>
          </div>
          <div className="code-input-group">
            <label>{i18n.__('Snippet description')}</label>
            <textarea ref="description" className="description" />
          </div>
          <div className="code-input-group">
            <label>{i18n.__('Snippet content')}</label>
            <div className="code" ref="editor" />
          </div>
          <button
            className="float-right"
            onClick={this.createSnippet.bind(this)}
          >
            {i18n.__('Create')}
          </button>
        </div>
      </ModalSkeleton>
    )
  }
}
