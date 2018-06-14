import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import eventEmitter from 'lib/event-emitter'
import i18n from 'render/lib/i18n'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'

export default class CreateMultiFilesSnippetModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: '',
      name: 'createMultiFilesSnippetModal'
    }
  }

  componentDidMount () {
    const { config } = this.props
    const {
      fontFamily,
      showLineNumber,
      theme,
      tabSize,
      indentUsingTab
    } = config.editor
    this.editor = CodeMirror(this.refs.editor, {
      lineNumbers: showLineNumber,
      theme: theme,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      autoRefresh: true
    })

    this.editor.setOption('indentUnit', tabSize)
    this.editor.setOption('tabSize', tabSize)
    this.editor.setOption('indentWithTabs', indentUsingTab)
    this.editor.setSize('100%', '200px')
    this.editor.getWrapperElement().style.fontFamily = fontFamily

    eventEmitter.on('modal:onClose', (event, name) => {
      if (name === this.state.name) {
        this.reset()
      }
    })
  }

  changeLang () {
    const snippetLang = this.refs.lang.value
    const snippetMode = CodeMirror.findModeByName(snippetLang).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    this.editor.setOption('mode', snippetMode)
  }

  createSnippet () {
    const snippetName        = this.refs.snippetName.value
    const snippetLang        = this.refs.lang.value
    const snippetCode        = this.editor.getValue()
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
    this.reset()
    eventEmitter.emit('modal:close', this.state.name)
  }

  reset () {
    this.refs.snippetName.value  = ''
    this.refs.description.value  = ''
    this.refs.lang.selectedIndex = 0
    this.editor.setValue('')
  }

  render () {
    i18n.setLocale(this.props.config.ui.language)
    return (
      <ModalSkeleton name={this.state.name}>
        <h2 className='modal-title'>{ i18n.__('Create snippet') }</h2>
        <div className='modal-content'>
          <p className='error'>{this.state.error}</p>
          <div className='input-group'>
            <label>{ i18n.__('Snippet name') }</label>
            <input type='text' ref='snippetName' />
          </div>
          <div className='code-input-group'>
            <label>{ i18n.__('Snippet description') }</label>
            <textarea ref='description'></textarea>
          </div>
          <div className='code-input-group'>
            <label>{ i18n.__('Snippet content') }</label>
            <div className='code' ref='editor'></div>
          </div>
          <button
            className='float-right'
            onClick={this.createSnippet.bind(this)}>
            { i18n.__('Create') }
          </button>
        </div>
      </ModalSkeleton>
    )
  }
}
