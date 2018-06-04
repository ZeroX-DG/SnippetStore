import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import { toast } from 'react-toastify'
import Clipboard from 'core/functions/clipboard'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import './snippet-item'

export default class SnippetItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false
    }
  }
  
  componentDidMount () {
    const { snippet, config } = this.props
    const { theme, showLineNumber } = config.editor
    const snippetMode = CodeMirror.findModeByName(snippet.lang).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)

    this.editor = CodeMirror(this.refs.editor, {
      lineNumbers: showLineNumber,
      value: snippet.value,
      foldGutter: true,
      mode: snippetMode,
      theme: theme,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      readOnly: true
    })

    this.editor.setSize('100%', '100%')
  }

  copySnippet () {
    Clipboard.set(this.props.snippet.value)
    toast.info('Copied to clipboard', { autoClose: 2000 })
  }

  handleEditButtonClick () {
    this.setState({ isEditing: true })
    this.editor.setOption('readOnly', false)
  }

  handleSaveChangesClick () {
    const newSnippet = Object.assign({}, this.props.snippet)
    newSnippet.value = this.editor.getValue()

    this.props.store.updateSnippet(newSnippet)

    this.setState({ isEditing: false })
    this.editor.setOption('readOnly', true)
  }

  render () {
    const { snippet } = this.props
    const { isEditing } = this.state
    const snippetMode = CodeMirror.findModeByName(snippet.lang).mode
    return (
      <div className='snippet-item'>
        <div className='header'>
          <div className='info'>
            <i className={`devicon-${snippetMode}-plain colored`} data-tip={snippet.lang}></i>
            &nbsp;&nbsp;
            {snippet.name}
          </div>
          <div className='tools'>
            <ReactTooltip place='bottom' effect='solid' />
            {
              isEditing
              ? 
              <div
                className='save-btn'
                data-tip='save changes'
                onClick={this.handleSaveChangesClick.bind(this)}>
                <FAIcon icon='check'/>
              </div>
              :
              <div
                className='edit-btn'
                data-tip='edit'
                onClick={this.handleEditButtonClick.bind(this)}>
                <FAIcon icon='edit'/>
              </div>
            }
            <div className='copy-btn' data-tip='copy' onClick={this.copySnippet.bind(this)}>
              <FAIcon icon='copy'/>
            </div>
          </div>
        </div>
        <div className='code' ref='editor'></div>
        <div className='footer'>
          <div className='info-left'>
            <span className='createAt'>Create at: { snippet.createAt }</span>
            <span className='updateAt'>Last update: { snippet.updateAt }</span>
          </div>
          <div className='info-right'>Copy: { snippet.copy } times</div>
        </div>
      </div>
    )
  }
}
