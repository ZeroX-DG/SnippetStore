import React from 'react'
import CodeMirror from 'codemirror'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import DateFormat from 'dateformat'
import './snippet-item'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/seti.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/indent-fold'
import 'codemirror/addon/fold/markdown-fold'

export default class SnippetItem extends React.Component {

  componentDidMount () {
    const { snippet, config } = this.props
    const { theme, showLineNumber } = config
    require(`codemirror/mode/${snippet.lang}/${snippet.lang}`)

    this.editor = CodeMirror(this.refs.editor, {
      lineNumbers: showLineNumber,
      value: snippet.value,
      foldGutter: true,
      mode: snippet.lang,
      theme: theme,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      readOnly: true
    })

    this.editor.setSize('100%', '100%')
  }

  render () {
    const { snippet } = this.props
    return (
      <div className='snippet-item'>
        <div className='header'>
          <div className='info'>
            <i className={`devicon-${snippet.lang}-plain colored`} data-tip={snippet.lang}></i>
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
            <span className='createAt'>Create at: { DateFormat(snippet.createAt) }</span>
            <span className='updateAt'>Last update: { DateFormat(snippet.updateAt) }</span>
          </div>
          <div className='info-right'>Copy: { snippet.copy } times</div>
        </div>
      </div>
    )
  }
}
