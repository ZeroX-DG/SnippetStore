import React from 'react'
import _ from 'lodash'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import { toast } from 'react-toastify'
import Clipboard from 'core/functions/clipboard'
import formatDate from 'lib/date-format'
import defaultLanguageIcon from 'resources/image/defaultLanguageIcon.png'
import isDevIconExists from 'lib/devicon-exists'
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
    const newSnippet = _.clone(this.props.snippet)
    this.props.store.increaseCopyTime(newSnippet)
  }

  handleEditButtonClick () {
    this.setState({ isEditing: true })
    this.editor.setOption('readOnly', false)
  }

  handleSaveChangesClick () {
    const valueChanged = this.props.snippet.value !== this.editor.getValue()
    const langChanged  = this.props.snippet.lang !== this.refs.lang.value
    const nameChanged  = this.props.snippet.name !== this.refs.name.value
    if (valueChanged || langChanged || nameChanged) {
      const newSnippet = _.clone(this.props.snippet)
      newSnippet.value = this.editor.getValue()
      newSnippet.lang  = this.refs.lang.value
      newSnippet.name  = this.refs.name.value
      if (langChanged) {
        const snippetMode = CodeMirror.findModeByName(newSnippet.lang).mode
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        this.editor.setOption('mode', snippetMode)
      }
      this.props.store.updateSnippet(newSnippet)
    }

    this.setState({ isEditing: false })
    this.editor.setOption('readOnly', true)
  }

  handleDeleteClick () {
    const { snippet } = this.props
    if (confirm(`Are you sure to delete the snippet ${snippet.name}?`)) {
      const newSnippet = _.clone(this.props.snippet)
      this.props.store.deleteSnippet(newSnippet)
    }
  }

  render () {
    const { snippet } = this.props
    const { isEditing } = this.state
    const langMode = CodeMirror.findModeByName(snippet.lang)
    const snippetMode = langMode.mode
    let languageIcon = <img src={defaultLanguageIcon} className='lang-icon' data-tip={snippet.lang}/>
    if (langMode.alias) {
      for (let i = 0; i < langMode.alias.length; i++) {
        if (isDevIconExists(`devicon-${langMode.alias[i]}-plain`)) {
          languageIcon = <i className={`devicon-${langMode.alias[i]}-plain colored`} data-tip={snippet.lang}/>
          break
        }
      }
    }
    // if it's not alias then maybe the mode name ?
    if (isDevIconExists(`devicon-${snippetMode}-plain`)) {
      languageIcon = <i className={`devicon-${snippetMode}-plain colored`} data-tip={snippet.lang} />
    }
    return (
      <div className='snippet-item'>
        <ReactTooltip place='bottom' effect='solid' />
        <div className='header'>
          <div className='info'>
            { languageIcon }
            &nbsp;&nbsp;&nbsp;
            {
              isEditing
              ? <input type='text' ref='name' defaultValue={snippet.name} />
              : snippet.name
            }
          </div>
          <div className='tools'>
            {
              isEditing &&
              <select ref='lang' defaultValue={snippet.lang}>
                {
                  CodeMirror.modeInfo.map((mode, index) => (
                    <option
                      value={mode.name}
                      key={index}>
                      {mode.name}
                    </option>
                  ))
                }
              </select>
            }
            <div
              className='copy-btn'
              data-tip='copy'
              onClick={this.copySnippet.bind(this)}>
              <FAIcon icon='copy'/>
            </div>
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
            <div
              className='delete-btn'
              data-tip='delete snippet'
              onClick={this.handleDeleteClick.bind(this)}>
              <FAIcon icon='trash-alt'/>
            </div>
          </div>
        </div>
        <div className='code' ref='editor'></div>
        <div className='footer'>
          <div className='info-left'>
            <span className='createAt'>Create at: { formatDate(snippet.createAt) }</span>
            <span className='updateAt'>Last update: { formatDate(snippet.updateAt) }</span>
          </div>
          <div className='info-right'>Copy: { snippet.copy } times</div>
        </div>
      </div>
    )
  }
}
