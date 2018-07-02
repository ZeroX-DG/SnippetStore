import React, { Fragment } from 'react'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import Clipboard from 'core/functions/clipboard'
import formatDate from 'lib/date-format'
import ReactTooltip from 'react-tooltip'
import _ from 'lodash'
import eventEmitter from 'lib/event-emitter'
import { toast } from 'react-toastify'
import { observer } from 'mobx-react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'
import './snippet-detail'

@observer
export default class SnippetDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false
    }
  }

  componentDidUpdate () {
    const { config, store } = this.props
    const { selectedSnippet } = store
    if (selectedSnippet) {
      const { theme, showLineNumber } = config.editor
      const snippetMode = CodeMirror.findModeByName(selectedSnippet.lang).mode
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
      const gutters = showLineNumber
        ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        : []
      this.editor =
        this.editor ||
        CodeMirror(this.refs.editor, {
          lineNumbers: showLineNumber,
          value: selectedSnippet.value,
          foldGutter: showLineNumber,
          mode: snippetMode,
          theme: theme,
          gutters: gutters,
          readOnly: true,
          autoCloseBrackets: true,
          autoRefresh: true
        })
      this.editor.setOption('mode', snippetMode)
      this.editor.setValue(selectedSnippet.value)
      this.editor.setSize('100%', '100%')
      this.applyEditorStyle()
    }
  }

  applyEditorStyle (props) {
    const { config, store } = props || this.props
    const { selectedSnippet } = store
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
      const snippetMode = CodeMirror.findModeByName(selectedSnippet.lang).mode
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

  renderEmptySnippet () {
    return (
      <h1 className="emptyMessage">{i18n.__('Pick a snippet from list')}</h1>
    )
  }

  renderTopBar () {
    const { isEditing } = this.state
    return (
      <div className="top-bar">
        <div className="left-tool">
          {!isEditing && (
            <div
              className="copy-btn"
              onClick={this.copySnippet.bind(this)}
              data-tip={i18n.__('copy')}
            >
              <FAIcon icon="copy" />
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
          {isEditing && (
            <div
              className="discard-btn"
              data-tip={i18n.__('discard changes')}
              onClick={this.handleDiscardChangesClick.bind(this)}
            >
              <FAIcon icon="times" />
            </div>
          )}
        </div>
        <div className="right-tool">
          {!isEditing && (
            <div
              className="delete-btn"
              onClick={this.handleDeleteClick.bind(this)}
              data-tip={i18n.__('delete snippet')}
            >
              <FAIcon icon="trash-alt" />
            </div>
          )}
        </div>
      </div>
    )
  }

  copySnippet () {
    const { config, store } = this.props
    const { selectedSnippet } = store
    Clipboard.set(selectedSnippet.value)
    if (config.ui.showCopyNoti) {
      toast.info(i18n.__('Copied to clipboard'), { autoClose: 2000 })
    }
    const newSnippet = _.clone(selectedSnippet)
    store.increaseCopyTime(newSnippet)
  }

  handleDeleteClick () {
    const { config, store } = this.props
    const { selectedSnippet } = store
    if (config.ui.showDeleteConfirmDialog) {
      if (!confirm(i18n.__('Are you sure to delete this snippet?'))) {
        return
      }
    }
    const newSnippet = _.clone(selectedSnippet)
    store.deleteSnippet(newSnippet)
    store.selectedSnippet = null
    // reset editor null so that it will re-initiate editor with the new snippet
    this.editor = null
  }

  handleEditButtonClick () {
    this.setState({ isEditing: true })
    eventEmitter.emit('snippet-detail:edit-start')
    this.editor.setOption('readOnly', false)
  }

  handleDiscardChangesClick () {
    this.setState({ isEditing: false }, () => {
      eventEmitter.emit('snippet-detail:edit-end')
      this.editor.setOption('readOnly', true)
    })
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

  renderSnippet () {
    const { config, store } = this.props
    const { selectedSnippet } = store
    return (
      <Fragment>
        {this.renderTopBar()}
        <div className="header">
          <p className="snippet-name">{selectedSnippet.name}</p>
          <p>
            {config.ui.showSnippetCreateTime && (
              <span className="createAt info">
                {i18n.__('Create at')} : {formatDate(selectedSnippet.createAt)}
              </span>
            )}
            {config.ui.showSnippetUpdateTime && (
              <span className="updateAt info">
                {i18n.__('Last update')}: {formatDate(selectedSnippet.updateAt)}
              </span>
            )}
            {config.ui.showSnippetCopyCount && (
              <span className="copyCount info">
                {i18n.__('Copy')} : {selectedSnippet.copy} {i18n.__('times')}
              </span>
            )}
          </p>
        </div>
        {selectedSnippet.tags.length > 0 && (
          <p className="tags">
            <span className="icon">
              <FAIcon icon="tags" />
            </span>
            {selectedSnippet.tags.join(', ')}
          </p>
        )}
        {selectedSnippet.description && (
          <p className="description">{selectedSnippet.description}</p>
        )}
        <div className="code" ref="editor" />
      </Fragment>
    )
  }

  render () {
    const { selectedSnippet } = this.props.store
    return (
      <div className="snippet-detail">
        <ReactTooltip place="bottom" effect="solid" />
        {!selectedSnippet && this.renderEmptySnippet()}
        {selectedSnippet && this.renderSnippet()}
      </div>
    )
  }
}
