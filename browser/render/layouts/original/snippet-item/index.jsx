import React from 'react'
import _ from 'lodash'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import { toast } from 'react-toastify'
import Clipboard from 'core/functions/clipboard'
import formatDate from 'lib/date-format'
import defaultLanguageIcon from 'resources/image/defaultLanguageIcon.png'
import isDevIconExists from 'lib/devicon-exists'
import TagItem from 'render/components/tag-item'
import i18n from 'render/lib/i18n'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'
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
    this.editor.setSize('100%', 'auto')
    this.applyEditorStyle()
  }

  applyEditorStyle (props) {
    const { snippet, config } = props || this.props
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
    wrapperElement.querySelector('.CodeMirror-scroll').style.maxHeight = '300px'
    this.editor.refresh()
  }

  componentWillReceiveProps (props) {
    this.applyEditorStyle(props)
  }

  handleSnippetLangChange () {
    const snippetMode = CodeMirror.findModeByName(this.refs.lang.value).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    this.editor.setOption('mode', snippetMode)
  }

  copySnippet () {
    Clipboard.set(this.props.snippet.value)
    if (this.props.config.ui.showCopyNoti) {
      toast.info(i18n.__('Copied to clipboard'), { autoClose: 2000 })
    }
    const newSnippet = _.clone(this.props.snippet)
    this.props.store.increaseCopyTime(newSnippet)
  }

  handleEditButtonClick () {
    this.setState({ isEditing: true })
    this.editor.setOption('readOnly', false)
  }

  handleSaveChangesClick () {
    const { snippet } = this.props
    const valueChanged = snippet.value !== this.editor.getValue()
    const langChanged = snippet.lang !== this.refs.lang.value
    const nameChanged = snippet.name !== this.refs.name.value
    const newTags = this.refs.tags.value.replace(/ /g, '').split(',')
    const tagChanged = !_.isEqual(snippet.tags, newTags)
    const descripChanged = snippet.description !== this.refs.description.value
    if (
      valueChanged ||
      langChanged ||
      nameChanged ||
      tagChanged ||
      descripChanged
    ) {
      const newSnippet = _.clone(this.props.snippet)
      newSnippet.value = this.editor.getValue()
      newSnippet.lang = this.refs.lang.value
      newSnippet.name = this.refs.name.value
      newSnippet.tags = newTags
      newSnippet.description = this.refs.description.value
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
    const { snippet, config } = this.props
    if (config.ui.showDeleteConfirmDialog) {
      if (!confirm(i18n.__('Are you sure to delete this snippet?'))) {
        return
      }
    }
    const newSnippet = _.clone(snippet)
    this.props.store.deleteSnippet(newSnippet)
  }

  renderHeader () {
    const { snippet } = this.props
    const { isEditing } = this.state
    const langMode = CodeMirror.findModeByName(snippet.lang)
    const snippetMode = langMode.mode
    let languageIcon = (
      <img
        src={defaultLanguageIcon}
        className="lang-icon"
        data-tip={snippet.lang}
      />
    )
    if (langMode.alias) {
      for (let i = 0; i < langMode.alias.length; i++) {
        const alias = langMode.alias[i]
        if (isDevIconExists(`devicon-${alias}-plain`)) {
          languageIcon = (
            <i
              className={`devicon-${alias}-plain colored`}
              data-tip={snippet.lang}
            />
          )
          break
        }
      }
    }
    // if it's not alias then maybe the mode name ?
    if (isDevIconExists(`devicon-${snippetMode}-plain`)) {
      languageIcon = (
        <i
          className={`devicon-${snippetMode}-plain colored`}
          data-tip={snippet.lang}
        />
      )
    }
    return (
      <div className="header">
        <div className="info">
          {languageIcon}
          &nbsp;&nbsp;&nbsp;
          {isEditing ? (
            <input type="text" ref="name" defaultValue={snippet.name} />
          ) : (
            snippet.name
          )}
        </div>
        <div className="tools">
          {isEditing && (
            <select
              ref="lang"
              onChange={this.handleSnippetLangChange.bind(this)}
              defaultValue={snippet.lang}
            >
              {CodeMirror.modeInfo.map((mode, index) => (
                <option value={mode.name} key={index}>
                  {mode.name}
                </option>
              ))}
            </select>
          )}
          {!isEditing && (
            <div
              className="copy-btn"
              data-tip={i18n.__('copy')}
              onClick={this.copySnippet.bind(this)}
            >
              <FAIcon icon="copy" />
            </div>
          )}
          {isEditing && (
            <div
              className="discard-btn"
              data-tip={i18n.__('discard changes')}
              onClick={this.handleDiscardChangesClick.bind(this)}
            >
              <FAIcon icon="times" />
            </div>
          )}
          {isEditing ? (
            <div
              className="save-btn"
              data-tip={i18n.__('save changes')}
              onClick={this.handleSaveChangesClick.bind(this)}
            >
              <FAIcon icon="check" />
            </div>
          ) : (
            <div
              className="edit-btn"
              data-tip={i18n.__('edit')}
              onClick={this.handleEditButtonClick.bind(this)}
            >
              <FAIcon icon="edit" />
            </div>
          )}
          {!isEditing && (
            <div
              className="delete-btn"
              data-tip={i18n.__('delete snippet')}
              onClick={this.handleDeleteClick.bind(this)}
            >
              <FAIcon icon="trash-alt" />
            </div>
          )}
        </div>
      </div>
    )
  }

  handleDiscardChangesClick () {
    this.setState({ isEditing: false }, () => {
      this.editor.setOption('readOnly', true)
    })
  }

  renderTagList () {
    const { snippet, config } = this.props
    const { isEditing } = this.state
    const tags = snippet.tags.filter(tag => tag)
    return (
      <div className="tag-list">
        <span className="icon">
          <FAIcon icon="tags" />
        </span>
        {isEditing ? (
          <input type="text" ref="tags" defaultValue={tags.join(', ')} />
        ) : tags.length > 0 ? (
          tags.map((tag, index) => (
            <TagItem config={config} tag={tag} key={index} />
          ))
        ) : (
          'No tag'
        )}
      </div>
    )
  }

  renderDescription () {
    const { snippet } = this.props
    const { isEditing } = this.state
    return (
      <div className={`description ${isEditing ? 'editing' : ''}`}>
        {isEditing ? (
          <textarea ref="description" defaultValue={snippet.description} />
        ) : (
          snippet.description
        )}
      </div>
    )
  }

  renderFooter () {
    const { snippet, config } = this.props
    return (
      <div className="footer">
        <div className="info-left">
          {config.ui.showSnippetCreateTime && (
            <span className="createAt">
              {i18n.__('Create at')} : {formatDate(snippet.createAt)}
            </span>
          )}
          {config.ui.showSnippetUpdateTime && (
            <span className="updateAt">
              {i18n.__('Last update')} : {formatDate(snippet.updateAt)}
            </span>
          )}
        </div>
        <div className="info-right">
          {config.ui.showSnippetCopyCount && (
            <span className="copyCount">
              {i18n.__('Copy')} : {snippet.copy} {i18n.__('times')}
            </span>
          )}
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className="snippet-item original">
        <ReactTooltip place="bottom" effect="solid" />
        {this.renderHeader()}
        {this.renderTagList()}
        {this.renderDescription()}
        <div className="code" ref="editor" />
        {this.renderFooter()}
      </div>
    )
  }
}
