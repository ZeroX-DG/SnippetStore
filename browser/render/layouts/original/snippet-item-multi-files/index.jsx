import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import i18n from 'render/lib/i18n'
import Clipboard from 'core/functions/clipboard'
import { toast } from 'react-toastify'
import { toJS } from 'mobx'
import _ from 'lodash'
import formatDate from 'lib/date-format'
import { getExtension, generateKey } from 'lib/util'
import TagItem from 'render/components/tag-item'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'
import './snippet-item-multi-file'

export default class SnippetItemMultiFiles extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      selectedFile: 0,
      editingFiles: []
    }
  }

  componentDidMount () {
    const { snippet, config } = this.props
    const { selectedFile } = this.state
    const { theme, showLineNumber, tabSize, indentUsingTab } = config.editor
    const file = snippet.files[selectedFile]
    const fileExtension = getExtension(file.name)
    const resultMode = CodeMirror.findModeByExtension(fileExtension)
    let snippetMode = 'null'
    if (resultMode) {
      snippetMode = resultMode.mode
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    }

    this.setState({ editingFiles: snippet.files })

    const gutters = showLineNumber
      ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      : []

    this.editor = CodeMirror(this.refs.editor, {
      lineNumbers: showLineNumber,
      value: file.value,
      foldGutter: showLineNumber,
      mode: snippetMode,
      theme: theme,
      gutters: gutters,
      readOnly: true,
      autoCloseBrackets: true,
      autoRefresh: true
    })

    this.editor.setOption('indentUnit', tabSize)
    this.editor.setOption('tabSize', tabSize)
    this.editor.setOption('indentWithTabs', indentUsingTab)
    this.editor.setSize('100%', 'auto')
    this.editor.on('change', () => {
      this.handleEditingFileValueChange()
    })
    this.applyEditorStyle()
  }

  applyEditorStyle (props) {
    const { snippet, config } = props || this.props
    const { isEditing, editingFiles, selectedFile } = this.state
    const {
      theme,
      showLineNumber,
      fontFamily,
      fontSize,
      tabSize,
      indentUsingTab
    } = config.editor
    const gutters = showLineNumber
      ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
      : []

    const totalSnippets = snippet.files.length
    const file = isEditing
      ? editingFiles[selectedFile]
      : snippet.files[selectedFile]
    if (!file) {
      this.handleChangeFileClick(totalSnippets - 1)
      return
    }
    const fileExtension = getExtension(file.name)
    const resultMode = CodeMirror.findModeByExtension(fileExtension)
    let snippetMode = 'null'
    if (resultMode) {
      snippetMode = resultMode.mode
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    }

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
    const scrollElement = wrapperElement.querySelector('.CodeMirror-scroll')
    scrollElement.style.maxHeight = '300px'
    const FileList = this.refs.fileList
    scrollElement.style.minHeight = `${FileList.clientHeight}px`
    this.editor.refresh()
  }

  componentWillReceiveProps (props) {
    this.applyEditorStyle(props)
  }

  renderHeader () {
    const { isEditing } = this.state
    const { snippet } = this.props
    return (
      <div className="header">
        <div className="info">
          {isEditing ? (
            <input type="text" ref="name" defaultValue={snippet.name} />
          ) : (
            snippet.name
          )}
        </div>
        <div className="tools">
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
    const { tags, name, description } = this.refs
    const { snippet, store } = this.props
    const { editingFiles } = this.state
    const nameChanged = snippet.name !== name.value
    const newTags = tags.value.replace(/ /g, '').split(',')
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
    this.setState({ isEditing: false }, () => {
      this.resetSnippetHeight()
    })
    this.editor.setOption('readOnly', true)
  }

  handleEditButtonClick () {
    const { snippet } = this.props
    this.setState({ isEditing: true }, () => {
      this.applyEditorStyle()
      this.setState({ editingFiles: snippet.files })
      this.editor.setOption('readOnly', false)
    })
  }

  handleDiscardChangesClick () {
    const { snippet } = this.props
    this.setState(
      {
        isEditing: false,
        editingFiles: snippet.files,
        selectedFile: 0
      },
      () => {
        this.editor.setOption('readOnly', true)
        this.resetSnippetHeight()
      }
    )
  }

  renderTagList () {
    const { snippet, config } = this.props
    const { isEditing } = this.state
    return (
      <div className="tag-list">
        <span className="icon">
          <FAIcon icon="tags" />
        </span>
        {isEditing ? (
          <input
            type="text"
            ref="tags"
            defaultValue={snippet.tags.join(', ')}
          />
        ) : (
          snippet.tags.map((tag, index) => (
            <TagItem config={config} tag={tag} key={index} />
          ))
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
          {files.map((file, index) => (
            <li
              key={file.key}
              onClick={() => this.handleChangeFileClick(index)}
              className={index === selectedFile ? 'selected' : ''}
            >
              {isEditing ? (
                <input
                  type="text"
                  className="fileName"
                  onChange={e => this.handleEditingFileNameChange(e, index)}
                  defaultValue={file.name}
                />
              ) : file.name ? (
                file.name
              ) : (
                'untitled'
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
          ))}
          {isEditing && (
            <li>
              <input
                type="text"
                ref="newFile"
                onFocus={this.handleNewFileFocus.bind(this)}
                placeholder="New file"
              />
            </li>
          )}
        </ul>
      </div>
    )
  }

  handleEditingFileNameChange (event, index) {
    const { editingFiles } = this.state
    const newEditingFiles = toJS(editingFiles)
    const name = event.target.value
    newEditingFiles[index].name = name
    const fileExtension = getExtension(name)
    const resultMode = CodeMirror.findModeByExtension(fileExtension)
    // if the mode for that language exists then use it otherwise use text
    if (resultMode) {
      const snippetMode = resultMode.mode
      if (snippetMode === 'htmlmixed') {
        require(`codemirror/mode/xml/xml`)
        this.editor.setOption('mode', 'xml')
        this.editor.setOption('htmlMode', true)
      } else {
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        this.editor.setOption('mode', snippetMode)
      }
    } else {
      this.editor.setOption('mode', 'null')
    }
    this.setState({ editingFiles: newEditingFiles })
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
      if (selectedFile > editingFiles.length - 1) {
        this.handleChangeFileClick(editingFiles.length - 1, () => {
          this.resetSnippetHeight()
        })
      }
    } else {
      toast.error(i18n.__('The snippet must have at least 1 file'))
    }
  }

  resetSnippetHeight () {
    // reset height
    this.refs.fileList.style.maxHeight = '0px'
    this.applyEditorStyle()
    setTimeout(() => {
      this.refs.fileList.style.maxHeight = '300px'
      this.applyEditorStyle()
    })
  }

  handleNewFileFocus () {
    const { editingFiles } = this.state
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
    this.applyEditorStyle()
  }

  handleChangeFileClick (index, callback) {
    const { snippet } = this.props
    const { editingFiles, isEditing } = this.state
    // set the new selected file index
    this.setState({ selectedFile: index }, () => {
      // if the snippet is in the editing mode, interact with the state instead
      // of the snippet in prop
      const file = isEditing ? editingFiles[index] : snippet.files[index]
      const fileExtension = getExtension(file.name)
      const resultMode = CodeMirror.findModeByExtension(fileExtension)
      // if the mode for that language exists then use it otherwise use text
      if (resultMode) {
        const snippetMode = resultMode.mode
        if (snippetMode === 'htmlmixed') {
          require(`codemirror/mode/xml/xml`)
          this.editor.setOption('mode', 'xml')
          this.editor.setOption('htmlMode', true)
        } else {
          require(`codemirror/mode/${snippetMode}/${snippetMode}`)
          this.editor.setOption('mode', snippetMode)
        }
      } else {
        this.editor.setOption('mode', 'null')
      }
      this.editor.setValue(file.value)
      this.resetSnippetHeight()
      if (callback && typeof callback === 'function') {
        callback()
      }
    })
  }

  handleEditingFileValueChange () {
    const { isEditing, selectedFile, editingFiles } = this.state
    if (isEditing) {
      const newEditingFiles = toJS(editingFiles)
      newEditingFiles[selectedFile].value = this.editor.getValue()
      this.setState({ editingFiles: newEditingFiles })
    }
  }

  render () {
    return (
      <div className="snippet-item-multi-files" ref="root">
        <ReactTooltip place="bottom" effect="solid" />
        {this.renderHeader()}
        {this.renderTagList()}
        {this.renderDescription()}
        <div className="inline">
          {this.renderFileList()}
          <div className="code" ref="editor" />
        </div>
        {this.renderFooter()}
      </div>
    )
  }
}
