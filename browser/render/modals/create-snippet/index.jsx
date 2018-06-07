import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import eventEmitter from 'lib/event-emitter'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'
const sander = require('sander')

export default class CreateSnippetModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: '',
      name: 'createSnippetModal'
    }
  }

  componentDidMount () {
    const { config } = this.props
    const { fontFamily, showLineNumber, theme, tabSize, indentUsingTab } = config.editor
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
    this.editor.setSize('100%', '300px')
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
    const snippetName = this.refs.snippetName.value
    const snippetLang = this.refs.lang.value
    const snippetCode = this.editor.getValue()

    if (!snippetName || !snippetLang) {
      this.setState({ error: 'Please specify at least snippet name and language' })
      return
    }

    this.props.store.createSnippet({
      name: snippetName,
      lang: snippetLang,
      value: snippetCode
    })
    this.reset()
    eventEmitter.emit('modal:close', this.state.name)
  }

  reset () {
    this.refs.snippetName.value = ''
    this.refs.lang.selectedIndex = 0
    this.editor.setValue('')
  }

  render () {
    return (
      <ModalSkeleton name={this.state.name}>
        <h2 className='modal-title'>Create snippet</h2>
        <div className='modal-content'>
          <p className='error'>{this.state.error}</p>
          <div className='input-group'>
            <label>Snippet name</label>
            <input type='text' ref='snippetName' />
          </div>
          <div className='input-group'>
            <label>Snippet language</label>
            <select ref='lang' onChange={this.changeLang.bind(this)}>
              {
                CodeMirror.modeInfo.map((mode, index) => (
                  <option value={mode.name} key={index}>{mode.name}</option>
                ))
              }
            </select>
          </div>
          <div className='code-input-group'>
            <label>Snippet code</label>
            <div className='code' ref='editor'></div>
          </div>
          <button
            className='float-right'
            onClick={this.createSnippet.bind(this)}>Create</button>
        </div>
      </ModalSkeleton>
    )
  }
}
