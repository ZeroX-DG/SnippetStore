import React, { Fragment } from 'react'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import Clipboard from 'core/functions/clipboard'
import formatDate from 'lib/date-format'
import ReactTooltip from 'react-tooltip'
import _ from 'lodash'
import eventEmitter from 'lib/event-emitter'
import defaultLanguageIcon from 'resources/image/defaultLanguageIcon.png'
import isDevIconExists from 'lib/devicon-exists'
import TagItem from 'render/components/tag-item'
import { toast } from 'react-toastify'
import CodeEditor from 'render/components/code-editor'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import './snippet-detail'

export default class SnippetDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false
    }
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
    this.setState({ isEditing: true })
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
    const newTags = tags.value.replace(/ /g, '').split(',')
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
    return (
      <Fragment>
        {this.renderTopBar()}
        <div className="header">
          {this.renderSnippetName()}
          {this.renderOtherInfo()}
        </div>
        {this.renderTagList()}
        {this.renderDescription()}
        <CodeEditor
          config={config}
          type="single"
          snippet={snippet}
          ref="editor"
        />
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
          snippet.name
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
      <p className="tags">
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
      </p>
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
