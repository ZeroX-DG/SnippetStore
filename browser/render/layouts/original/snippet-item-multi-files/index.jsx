import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import i18n from 'render/lib/i18n'
import Clipboard from 'core/functions/clipboard'
import { toast } from 'react-toastify'
import { toJS } from 'mobx'
import _ from 'lodash'
import formatDate from 'lib/date-format'
import eventEmitter from 'lib/event-emitter'
import { getExtension, generateKey } from 'lib/util'
import TagItem from 'render/components/tag-item'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import CodeEditor from 'render/components/code-editor'
import TagInput from 'render/components/tag-input'
import './snippet-item-multi-file'
import exportSnippetAPI from 'core/API/snippet/export-snippet'
import getLanguageIcon from 'lib/getLangIcon'
import { remote } from 'electron'
import MarkdownPreview from '../../../components/markdown-preview/markdown-preview'
const { dialog } = remote

export default class SnippetItemMultiFiles extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      isPreview: false,
      selectedFile: 0,
      editingFiles: props.snippet.files.slice()
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
    const { isEditing, isPreview, selectedFile } = this.state
    const { snippet } = this.props
    const file = snippet.files[selectedFile]
    let langName = ''
    if (file) {
      const langMode = CodeMirror.findModeByExtension(getExtension(file.name))
      langName = langMode ? langMode.name : ''
    }
    return (
      <div className="header">
        <div className="info">
          {isEditing ? (
            <input type="text" ref="name" defaultValue={snippet.name} />
          ) : (
            <p className="snippet-name">{snippet.name}</p>
          )}
        </div>
        <div className="tools">
          {!isEditing &&
            !isPreview &&
            langName === 'Markdown' && (
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
            langName === 'Markdown' && (
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

  copySnippet () {
    const { snippet, config, store } = this.props
    const { selectedFile } = this.state
    const file = snippet.files[selectedFile]
    Clipboard.set(file.value)
    if (config.ui.showCopyNoti) {
      toast.info(i18n.__('Copied to clipboard'), { autoClose: 2000 })
    }
    const newSnippet = _.clone(snippet)
    store.increaseCopyTime(newSnippet)
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

  handleSaveChangesClick () {
    const { tags, name, description, editor } = this.refs
    const { snippet, store } = this.props
    const { editingFiles } = this.state
    const nameChanged = snippet.name !== name.value
    const newTags = tags.wrappedInstance.getTags()
    const tagChanged = !_.isEqual(snippet.tags, newTags)
    const descriptionChanged = snippet.description !== description.value
    if (tagChanged || descriptionChanged || nameChanged) {
      const newSnippet = _.clone(snippet)
      newSnippet.name = name.value
      newSnippet.tags = newTags
      newSnippet.description = description.value
      newSnippet.files = editingFiles
      store.updateSnippet(newSnippet)
    }
    this.setState({ isEditing: false })
    editor.setOption('readOnly', true)
    this.unbindEvents()
  }

  handleEditButtonClick () {
    this.setState({ isPreview: false }, () => {
      const { editor } = this.refs
      const { snippet } = this.props
      this.setState({ isEditing: true }, () => {
        editor.applyEditorStyle()
        this.setState({ editingFiles: snippet.files })
        editor.setOption('readOnly', false)
        this.bindEvents()
      })
    })
  }

  handleDiscardChangesClick () {
    const { snippet } = this.props
    const { editor } = this.refs
    this.setState(
      {
        isEditing: false,
        editingFiles: snippet.files,
        selectedFile: 0
      },
      () => {
        editor.setOption('readOnly', true)
        this.unbindEvents()
      }
    )
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
          i18n.__('No tag')
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

  renderFileList () {
    const { snippet } = this.props
    const { selectedFile, isEditing, editingFiles } = this.state
    const files = isEditing ? editingFiles : snippet.files
    return (
      <div className="file-list" ref="fileList">
        <ul>
          {files.map((file, index) => {
            const langMode = CodeMirror.findModeByExtension(
              getExtension(file.name)
            )
            const languageIcon = getLanguageIcon(
              langMode ? langMode.name : 'null'
            )
            return (
              <li
                key={file.key}
                onClick={() => this.handleChangeFileClick(index)}
                className={index === selectedFile ? 'selected' : ''}
              >
                {isEditing ? (
                  <input
                    type="text"
                    className="fileName"
                    onChange={e =>
                      this.handleEditingFileNameChange(e.target.value, index)
                    }
                    defaultValue={file.name}
                  />
                ) : (
                  <p className="file-info">
                    <span className="lang-icon">{languageIcon}</span>
                    {file.name || 'Untitled'}
                  </p>
                )}
                {
                  <span
                    className="icon"
                    onClick={e => this.handleDeleteFile(e, index)}
                  >
                    <FAIcon icon="trash-alt" />
                  </span>
                }
              </li>
            )
          })}
          {isEditing && (
            <li>
              <input
                type="text"
                ref="newFile"
                onFocus={this.handleNewFileFocus.bind(this)}
                placeholder={i18n.__('New file')}
              />
            </li>
          )}
        </ul>
      </div>
    )
  }

  handleEditingFileNameChange (newName, index) {
    clearTimeout(this.inputFileNameTimeout)
    this.inputFileNameTimeout = setTimeout(() => {
      const { editingFiles } = this.state
      const { editor } = this.refs
      const newEditingFiles = toJS(editingFiles)
      const name = newName
      newEditingFiles[index].name = name
      const fileExtension = getExtension(name)
      const resultMode = CodeMirror.findModeByExtension(fileExtension)
      // if the mode for that language exists then use it otherwise use text
      if (resultMode) {
        const snippetMode = resultMode.mode
        if (snippetMode === 'null') {
          editor.setOption('mode', 'null')
          editor.setOption('htmlMode', false)
        } else if (snippetMode === 'htmlmixed') {
          require(`codemirror/mode/xml/xml`)
          editor.setOption('mode', 'xml')
          editor.setOption('htmlMode', true)
        } else {
          require(`codemirror/mode/${snippetMode}/${snippetMode}`)
          editor.setOption('mode', snippetMode)
        }
      } else {
        editor.setOption('mode', 'text')
      }
      this.setState({ editingFiles: newEditingFiles })
    }, 200)
  }

  handleDeleteFile (event, fileIndex) {
    event.stopPropagation()
    const { snippet, store, config } = this.props
    const { editingFiles, isEditing, selectedFile } = this.state
    if (snippet.files.length > 1 && editingFiles.length > 1) {
      // remove directly if not in editing mode
      if (config.ui.showDeleteConfirmDialog) {
        if (!confirm(i18n.__('Are you sure to delete this file?'))) {
          return
        }
      }
      if (!isEditing) {
        const newSnippet = _.clone(snippet)
        newSnippet.files.splice(fileIndex, 1)
        store.updateSnippet(newSnippet)
      } else {
        // remove temporary from state
        const newEditingFiles = toJS(editingFiles)
        newEditingFiles.splice(fileIndex, 1)
        this.setState({ editingFiles: newEditingFiles })
      }
      // prevent reading deleted snippet
      if (fileIndex !== selectedFile) {
        // shift the selected file by 1 to replace to deleted file
        if (fileIndex < selectedFile) {
          // by shifting 1 index, the content will changed but we want to use the
          // old selected file content
          this.handleChangeFileClick(selectedFile - 1, selectedFile)
        }
      } else {
        // the selected file is deleted
        if (fileIndex === 0) {
          this.handleChangeFileClick(0, fileIndex + 1)
        } else {
          this.handleChangeFileClick(fileIndex - 1)
        }
      }
    } else {
      toast.error(i18n.__('The snippet must have at least 1 file'))
    }
  }

  handleNewFileFocus () {
    const { editingFiles } = this.state
    const { editor } = this.refs
    // make a clone of the current editing file list
    const newEditingFiles = toJS(editingFiles)
    // push a new file to the list
    newEditingFiles.push({ key: generateKey(), name: '', value: '' })
    this.setState({ editingFiles: newEditingFiles }, () => {
      // a new input tag will automatically created after set state and we want
      // to focus on that input tag
      const inputs = this.refs.fileList.firstChild.childNodes
      const input = inputs[inputs.length - 2].querySelector('input')
      this.handleChangeFileClick(newEditingFiles.length - 1)
      input.focus()
    })
    editor.applyEditorStyle()
  }

  handleChangeFileClick (index, useFileAtIndex, callback) {
    const { snippet } = this.props
    const { editingFiles, isEditing, selectedFile } = this.state
    const { editor } = this.refs
    // don't do anything if the current file is clicked twice!
    if (selectedFile === index) {
      return
    }
    // set the new selected file index
    this.setState({ selectedFile: index }, () => {
      // if the snippet is in the editing mode, interact with the state instead
      // of the snippet in prop
      const fileIndex = useFileAtIndex || index
      const file = isEditing ? editingFiles[fileIndex] : snippet.files[index]
      if (file) {
        const fileExtension = getExtension(file.name)
        const resultMode = CodeMirror.findModeByExtension(fileExtension)
        // if the mode for that language exists then use it otherwise use text
        if (resultMode) {
          const snippetMode = resultMode.mode
          if (snippetMode === 'null') {
            editor.setOption('mode', 'null')
            editor.setOption('htmlMode', false)
          } else if (snippetMode === 'htmlmixed') {
            require(`codemirror/mode/xml/xml`)
            editor.setOption('mode', 'xml')
            editor.setOption('htmlMode', true)
          } else {
            require(`codemirror/mode/${snippetMode}/${snippetMode}`)
            editor.setOption('mode', snippetMode)
          }
        } else {
          editor.setOption('mode', 'null')
        }
        editor.setValue(file.value)
        if (callback && typeof callback === 'function') {
          callback()
        }
      }
    })
  }

  handleEditingFileValueChange () {
    const { isEditing, selectedFile, editingFiles } = this.state
    const { editor } = this.refs
    if (isEditing) {
      const newEditingFiles = toJS(editingFiles)
      newEditingFiles[selectedFile].value = editor.getValue()
      this.setState({ editingFiles: newEditingFiles })
    }
  }

  render () {
    const { isEditing, selectedFile, editingFiles, isPreview } = this.state
    const { config, snippet } = this.props
    const file = snippet.files[selectedFile]
    let langName = ''
    if (file) {
      const langMode = CodeMirror.findModeByExtension(getExtension(file.name))
      langName = langMode ? langMode.name : ''
    }
    return (
      <div className="snippet-item-multi-files" ref="root">
        <ReactTooltip place="bottom" effect="solid" />
        {this.renderHeader()}
        {this.renderTagList()}
        {this.renderDescription()}
        <div className="inline">
          {this.renderFileList()}
          {langName === 'Markdown' && isPreview ? (
            <div style={{ height: '300px', width: '100%' }}>
              <MarkdownPreview markdown={file.value} />
            </div>
          ) : (
            <CodeEditor
              isEditing={isEditing}
              selectedFile={selectedFile}
              editingFiles={editingFiles}
              config={config}
              snippet={snippet}
              handleChangeFileClick={() => this.handleChangeFileClick()}
              handleEditingFileValueChange={() =>
                this.handleEditingFileValueChange()
              }
              type="multi"
              maxHeight="300px"
              ref="editor"
            />
          )}
        </div>
        {this.renderFooter()}
      </div>
    )
  }
}
