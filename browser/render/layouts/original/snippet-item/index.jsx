import React from 'react'
import _ from 'lodash'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import { toast } from 'react-toastify'
import Clipboard from 'core/functions/clipboard'
import formatDate from 'lib/date-format'
import TagItem from 'render/components/tag-item'
import i18n from 'render/lib/i18n'
import CodeEditor from 'render/components/code-editor'
import TagInput from 'render/components/tag-input'
import eventEmitter from 'lib/event-emitter'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import './snippet-item'
import { toJS } from 'mobx'
import exportSnippetAPI from 'core/API/snippet/export-snippet'
import getLanguageIcon from 'lib/getLangIcon'
import { remote } from 'electron'
import MarkdownPreview from '../../../components/markdown-preview/markdown-preview'
const { dialog } = remote

export default class SnippetItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      isPreview: false
    }
  }

  componentWillUnmount () {
    this.unbindEvents()
  }

  handlePreview () {
    this.setState({ isPreview: true })
  }

  handleExitPreview () {
    this.setState({ isPreview: false })
  }

  hasFocus () {
    const { editor, lang, name, tags, description } = this.refs
    return (
      editor.hasFocus() ||
      lang === document.activeElement ||
      name === document.activeElement ||
      tags.wrappedInstance.hasFocus() ||
      description === document.activeElement
    )
  }

  handleSnippetLangChange () {
    const { editor } = this.refs
    const snippetMode = CodeMirror.findModeByName(this.refs.lang.value).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    editor.setOption('mode', snippetMode)
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
    const { editor } = this.refs
    this.setState({ isEditing: true, isPreview: false })
    editor.setOption('readOnly', false)
    this.bindEvents()
  }

  bindEvents () {
    eventEmitter.on('snippets:saveAll', () => {
      if (this.state.isEditing && this.hasFocus()) {
        this.handleSaveChangesClick()
      }
    })
    eventEmitter.on('snippets:unSave', () => {
      if (this.state.isEditing && this.hasFocus()) {
        this.handleDiscardChangesClick()
      }
    })
  }

  unbindEvents () {
    eventEmitter.off('snippets:saveAll', () => {
      if (this.state.isEditing && this.hasFocus()) {
        this.handleSaveChangesClick()
      }
    })
    eventEmitter.off('snippets:unSave', () => {
      if (this.state.isEditing && this.hasFocus()) {
        this.handleDiscardChangesClick()
      }
    })
  }

  handleSaveChangesClick () {
    const { editor, lang, name, tags, description } = this.refs
    const { snippet } = this.props
    const newSnippetValue = editor.getValue()
    const newSnippetLang = lang.value
    const newSnippetName = name.value
    const newSnippetTags = tags.wrappedInstance.getTags()
    const newSnippetDescription = description.value
    const valueChanged = snippet.value !== newSnippetValue
    const langChanged = snippet.lang !== newSnippetLang
    const nameChanged = snippet.name !== newSnippetName
    const tagChanged = !_.isEqual(snippet.tags, newSnippetTags)
    const descripChanged = snippet.description !== newSnippetDescription
    if (
      valueChanged ||
      langChanged ||
      nameChanged ||
      tagChanged ||
      descripChanged
    ) {
      const newSnippet = _.clone(this.props.snippet)
      newSnippet.value = newSnippetValue
      newSnippet.lang = newSnippetLang
      newSnippet.name = newSnippetName
      newSnippet.tags = newSnippetTags
      newSnippet.description = newSnippetDescription
      if (langChanged) {
        const snippetMode = CodeMirror.findModeByName(newSnippet.lang).mode
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        editor.setOption('mode', snippetMode)
      }
      this.props.store.updateSnippet(newSnippet)
    }

    this.setState({ isEditing: false })
    editor.setOption('readOnly', true)
    this.unbindEvents()
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

  renderHeader () {
    const { snippet } = this.props
    const { isEditing, isPreview } = this.state
    const languageIcon = getLanguageIcon(snippet.lang)
    const isMarkdown =
      snippet.lang === 'Markdown' || snippet.lang === 'GitHub Flavored Markdown'
    return (
      <div className="header">
        <div className="info">
          {languageIcon}
          &nbsp;&nbsp;&nbsp;
          {isEditing ? (
            <input type="text" ref="name" defaultValue={snippet.name} />
          ) : (
            <p className="snippet-name">{snippet.name}</p>
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
              className="export-btn"
              data-tip={i18n.__('Export JSON')}
              onClick={this.exportSnippet.bind(this)}
            >
              <FAIcon icon="upload" />
            </div>
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
    const { editor } = this.refs
    this.setState({ isEditing: false }, () => {
      editor.setOption('readOnly', true)
    })
    this.unbindEvents()
  }

  renderTagList () {
    const { snippet, config } = this.props
    const { isEditing } = this.state
    const tags = snippet.tags.filter(tag => tag)
    return (
      <div
        className="tag-list"
        style={{ overflowY: isEditing ? 'initial' : 'hidden' }}
      >
        <span className="icon">
          <FAIcon icon="tags" />
        </span>
        {isEditing ? (
          <TagInput
            ref="tags"
            color={config.ui.tagColor}
            maxHeight="40px"
            defaultTags={tags}
          />
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
    const { isPreview } = this.state
    const { config, snippet } = this.props
    const isMarkdown =
      snippet.lang === 'Markdown' || snippet.lang === 'GitHub Flavored Markdown'
    return (
      <div className="snippet-item original">
        <ReactTooltip place="bottom" effect="solid" />
        {this.renderHeader()}
        {this.renderTagList()}
        {this.renderDescription()}
        {isMarkdown && isPreview ? (
          <div style={{ height: '300px' }}>
            <MarkdownPreview markdown={snippet.value} />
          </div>
        ) : (
          <CodeEditor
            config={config}
            type="single"
            snippet={snippet}
            ref="editor"
            maxHeight="300px"
          />
        )}
        {this.renderFooter()}
      </div>
    )
  }
}
