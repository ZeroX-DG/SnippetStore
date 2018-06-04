import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import './snippet-item'

export default class SnippetItem extends React.Component {

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

  render () {
    const { snippet } = this.props
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
            <div className='edit-btn' data-tip='edit'>
              <FAIcon icon='edit'/>
            </div>
            <div className='copy-btn' data-tip='copy'>
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
