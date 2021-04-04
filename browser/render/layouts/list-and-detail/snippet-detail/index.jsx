import React, { Fragment } from 'react'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import Clipboard from 'core/functions/clipboard'
import formatDate from 'lib/date-format'
import ReactTooltip from 'react-tooltip'
import _ from 'lodash'
import eventEmitter from 'lib/event-emitter'
import TagItem from 'render/components/tag-item'
import { toast } from 'react-toastify'
import CodeEditor from 'render/components/code-editor'
import TagInput from 'render/components/tag-input'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import './snippet-detail'
import { toJS } from 'mobx'
import exportSnippetAPI from 'core/API/snippet/export-snippet'
import getLanguageIcon from 'lib/getLangIcon'
import { remote } from 'electron'
import MarkdownPreview from 'render/components/markdown-preview/markdown-preview'
const { dialog } = remote

export default class SnippetDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      isPreview: false
    }
  }

  componentDidMount () {
    if (this.state.isEditing) {
      eventEmitter.on(
        'snippets:saveAll',
        this.handleSaveChangesEvent.bind(this)
      )
      eventEmitter.on(
        'snippets:unSave',
        this.handleDiscardChangesEvent.bind(this)
      )
    }
  }

  componentWillUnmount () {
    eventEmitter.off('snippets:saveAll', this.handleSaveChangesEvent.bind(this))
    eventEmitter.off(
      'snippets:unSave',
      this.handleDiscardChangesEvent.bind(this)
    )
  }

  handleSaveChangesEvent () {
    if (this.state.isEditing) {
      this.handleSaveChangesClick()
    }
  }

  handleDiscardChangesEvent () {
    if (this.state.isEditing) {
      this.handleDiscardChangesClick()
    }
  }

  handlePreview () {
    this.setState({ isPreview: true })
  }

  handleExitPreview () {
    this.setState({ isPreview: false })
  }

  exportSnippet () {
    const { snippet } = this.props
    const exportSnippet = toJS(snippet)
    dialog.showOpenDialog(
      {
        title: 'Pick export folder',
        buttonLabel: 'Export',
        properties: ['openDirectory']
      },
      paths => {
        if (paths && paths[0]) {
          const folder = paths[0]
          exportSnippetAPI(exportSnippet, folder)
          toast.success('Snippet exported!')
        }
      }
    )
  }

  renderTopBar () {
    const { isEditing, isPreview } = this.state
    const { snippet } = this.props
    const isMarkdown =
      snippet.lang === 'Markdown' || snippet.lang === 'GitHub Flavored Markdown'
    return (
      <div className={`top-bar ${isEditing ? 'editing' : ''}`}>
        <div className="left-tool">{this.renderSnippetName()}</div>
        <div className="right-tool">
          {!isEditing && (
            <div
              className="copy-btn"
              onClick={this.copySnippet.bind(this)}
              data-tip={i18n.__('copy')}
            >
              <FAIcon icon="copy" />
            </div>
          )}
          {!isEditing && (
            <div
              className="export-btn"
              data-tip={i18n.__('Export JSON')}
              onClick={this.exportSnippet.bind(this)}
            >
              <FAIcon icon="upload" />
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
          {!isEditing &&
            !isPreview &&
            isMarkdown && (
            <div
              className="preview-btn"
              data-tip={i18n.__('Preview')}
              onClick={this.handlePreview.bind(this)}
            >
              <FAIcon icon="eye" />
            </div>
          )}
          {!isEditing &&
            isPreview &&
            isMarkdown && (
            <div
              className="unpreview-btn"
              data-tip={i18n.__('Exit preview')}
              onClick={this.handleExitPreview.bind(this)}
            >
              <FAIcon icon="eye-slash" />
            </div>
          )}
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
    const { config, snippet, store } = this.props
    Clipboard.set(snippet.value)
    if (config.ui.showCopyNoti) {
      toast.info(i18n.__('Copied to clipboard'), { autoClose: 2000 })
    }
    const newSnippet = _.clone(snippet)
    store.increaseCopyTime(newSnippet)
  }

  handleDeleteClick () {
    const { config, snippet, store } = this.props
    if (config.ui.showDeleteConfirmDialog) {
      if (!confirm(i18n.__('Are you sure to delete this snippet?'))) {
        return
      }
    }
    const newSnippet = _.clone(snippet)
    store.deleteSnippet(newSnippet)
    store.selectedSnippet = null
  }

  handleEditButtonClick () {
    const { editor } = this.refs
    this.setState({ isEditing: true, isPreview: false })
    eventEmitter.emit('snippet-detail:edit-start')
    editor.setOption('readOnly', false)
  }

  handleDiscardChangesClick () {
    const { editor } = this.refs
    this.setState({ isEditing: false }, () => {
      eventEmitter.emit('snippet-detail:edit-end')
      editor.setOption('readOnly', true)
    })
  }

  handleSaveChangesClick () {
    const { editor, tags, lang, name, description } = this.refs
    const { store, snippet } = this.props
    const valueChanged = snippet.value !== editor.getValue()
    const langChanged = snippet.lang !== lang.value
    const nameChanged = snippet.name !== name.value
    const newTags = tags.wrappedInstance.getTags()
    const tagChanged = !_.isEqual(snippet.tags, newTags)
    const descripChanged = snippet.description !== description.value
    if (
      valueChanged ||
      langChanged ||
      nameChanged ||
      tagChanged ||
      descripChanged
    ) {
      const newSnippet = _.clone(snippet)
      newSnippet.value = editor.getValue()
      newSnippet.lang = lang.value
      newSnippet.name = name.value
      newSnippet.tags = newTags
      newSnippet.description = description.value
      if (langChanged) {
        const snippetMode = CodeMirror.findModeByName(newSnippet.lang).mode
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        editor.setOption('mode', snippetMode)
      }
      store.updateSnippet(newSnippet)
    }
    this.setState({ isEditing: false }, () => {
      eventEmitter.emit('snippet-detail:edit-end')
    })
    editor.setOption('readOnly', true)
  }

  renderSnippet () {
    const { config, snippet } = this.props
    const { isPreview } = this.state
    const isMarkdown =
      snippet.lang === 'Markdown' || snippet.lang === 'GitHub Flavored Markdown'
    return (
      <Fragment>
        {this.renderTopBar()}
        <div className="header">{this.renderOtherInfo()}</div>
        {this.renderTagList()}
        {this.renderDescription()}
        {isMarkdown && isPreview ? (
          <MarkdownPreview
            markdown={snippet.value}
            style={{ height: 'calc(100% - 230px)' }}
          />
        ) : (
          <CodeEditor
            config={config}
            type="single"
            snippet={snippet}
            ref="editor"
          />
        )}
      </Fragment>
    )
  }

  renderOtherInfo () {
    const { config, snippet } = this.props
    return (
      <p>
        {config.ui.showSnippetCreateTime && (
          <span className="createAt info">
            {i18n.__('Create at')} : {formatDate(snippet.createAt)}
          </span>
        )}
        {config.ui.showSnippetUpdateTime && (
          <span className="updateAt info">
            {i18n.__('Last update')}: {formatDate(snippet.updateAt)}
          </span>
        )}
        {config.ui.showSnippetCopyCount && (
          <span className="copyCount info">
            {i18n.__('Copy')} : {snippet.copy} {i18n.__('times')}
          </span>
        )}
      </p>
    )
  }

  renderSnippetName () {
    const { snippet } = this.props
    const { isEditing } = this.state
    const languageIcon = getLanguageIcon(snippet.lang)
    return (
      <p className="snippet-name">
        {!isEditing && <span className="icon">{languageIcon}</span>}
        {isEditing ? (
          <input
            type="text"
            className="snippet-name-input"
            ref="name"
            defaultValue={snippet.name}
          />
        ) : (
          <span>{snippet.name}</span>
        )}
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
      </p>
    )
  }

  handleSnippetLangChange () {
    const { editor } = this.refs
    const snippetMode = CodeMirror.findModeByName(this.refs.lang.value).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    editor.setOption('mode', snippetMode)
  }

  renderDescription () {
    const { snippet } = this.props
    const { isEditing } = this.state
    return (
      <p className={`description ${isEditing ? 'editing' : ''}`}>
        {isEditing ? (
          <textarea ref="description" defaultValue={snippet.description} />
        ) : (
          snippet.description
        )}
      </p>
    )
  }

  renderTagList () {
    const { snippet, config } = this.props
    const { isEditing } = this.state
    const tags = snippet.tags.filter(tag => tag)
    return (
      <div className="tags">
        <span className="icon">
          <FAIcon icon="tags" />
        </span>
        {isEditing ? (
          <TagInput ref="tags" color={config.ui.tagColor} defaultTags={tags} />
        ) : tags.length > 0 ? (
          tags.map((tag, index) => (
            <TagItem config={config} tag={tag} key={index} />
          ))
        ) : (
          i18n.__('No tag')
        )}
      </div>
    )
  }

  render () {
    const { snippet } = this.props
    return (
      <div className="snippet-detail">
        <ReactTooltip place="bottom" effect="solid" />
        {!snippet && this.renderEmptySnippet()}
        {snippet && this.renderSnippet()}
      </div>
    )
  }
}
