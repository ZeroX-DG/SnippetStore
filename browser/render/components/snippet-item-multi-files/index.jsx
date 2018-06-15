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
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'
import './snippet-item-multi-file'

export default class SnippetItemMultiFiles extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      selectedFile: 0
    }
  }

  componentDidMount () {
    const { snippet, config } = this.props
    const { selectedFile } = this.state
    const { theme, showLineNumber, tabSize, indentUsingTab } = config.editor
    const file = snippet.files[selectedFile]
    const fileExtension = getExtension(file.name)
    const snippetMode = CodeMirror.findModeByExtension(fileExtension).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)

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
    this.applyEditorStyle()
  }

  applyEditorStyle (props) {
    const { snippet, config } = props || this.props
    const { selectedFile } = this.state
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

    const file = snippet.files[selectedFile]
    const fileExtension = getExtension(file.name)
    const snippetMode = CodeMirror.findModeByExtension(fileExtension).mode
    require(`codemirror/mode/${snippetMode}/${snippetMode}`)

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
    const { snippet }      = this.props
    const { selectedFile } = this.state
    const fileList         = this.refs.fileList.querySelectorAll(`.fileName`)
    const file             = snippet.files[selectedFile]
    const valueChanged     = file.value !== this.editor.getValue()
    const fileNameRef      = fileList[selectedFile]
    const fileNameChanged  = file.name !== fileNameRef.value
    const nameChanged      = snippet.name !== this.refs.name.value
    const oldLang          = getExtension(file.name)
    const newLang          = getExtension(fileNameRef.value)
    const langChanged      = oldLang !== newLang
    const newTags          = this.refs.tags.value.replace(/ /g, '').split(',')
    const tagChanged       = !_.isEqual(snippet.tags, newTags)
    const descripChanged   = snippet.description !== this.refs.description.value
    const oldFilenames     = snippet.files.slice().map(file => file.name)
    const newFilenames     = this.extractFilenames(fileList)
    const fileListChanged  = !_.isEqual(oldFilenames, newFilenames)
    if (
      valueChanged    ||
      fileNameChanged ||
      langChanged     ||
      tagChanged      ||
      descripChanged  ||
      nameChanged     ||
      fileListChanged
    ) {
      const newSnippet                     = _.clone(this.props.snippet)
      newSnippet.name                      = this.refs.name.value
      newSnippet.files[selectedFile].value = this.editor.getValue()
      newSnippet.files[selectedFile].name  = fileNameRef.value
      newSnippet.tags                      = newTags
      newSnippet.description               = this.refs.description.value
      if (fileListChanged) {
        newSnippet.files = this.updateFileList(newFilenames)
      }
      if (langChanged) {
        const snippetMode = CodeMirror.findModeByExtension(newLang).mode
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        this.editor.setOption('mode', snippetMode)
      }
      this.props.store.updateSnippet(newSnippet)
    }

    const tempInputs = [...this.refs.fileList.querySelectorAll('.newFile')]
    tempInputs.forEach(input => input.parentElement.remove())
    this.setState({ isEditing: false })
    this.editor.setOption('readOnly', true)
  }

  extractFilenames (fileList) {
    return [...fileList].map(file => file.value)
  }

  updateFileList (newFileList) {
    const { snippet } = this.props
    const newSnippet  = _.clone(snippet)
    let files         = newSnippet.files
    files             = toJS(files)
    newFileList = newFileList.filter(newFile => newFile) // remove empty name file
    // filter all files that has been removed
    files = files.filter(file => newFileList.indexOf(file.name) !== -1)
    // add new files
    newFileList.forEach(file => {
      if (!files.find(ffile => ffile.name === file)) {
        files.push({ key: generateKey(), name: file, value: '' })
      }
    })
    return files
  }

  handleEditButtonClick () {
    this.setState({ isEditing: true }, () => {
      this.applyEditorStyle()
      this.editor.setOption('readOnly', false)
    })
  }

  renderHeader () {
    const { isEditing } = this.state
    const { snippet } = this.props
    return (
      <div className='header'>
        <div className='info'>
          {
            isEditing
              ? <input type='text' ref='name' defaultValue={snippet.name} />
              : snippet.name
          }
        </div>
        <div className='tools'>
          <div
            className='copy-btn'
            data-tip={ i18n.__('copy') }
            onClick={this.copySnippet.bind(this)}>
            <FAIcon icon='copy'/>
          </div>
          {
            isEditing
              ? <div
                className='save-btn'
                data-tip={ i18n.__('save changes') }
                onClick={this.handleSaveChangesClick.bind(this)}>
                <FAIcon icon='check'/>
              </div>
              : <div
                className='edit-btn'
                data-tip={ i18n.__('edit') }
                onClick={this.handleEditButtonClick.bind(this)}>
                <FAIcon icon='edit'/>
              </div>
          }
          <div
            className='delete-btn'
            data-tip={ i18n.__('delete snippet') }
            onClick={this.handleDeleteClick.bind(this)}>
            <FAIcon icon='trash-alt'/>
          </div>
        </div>
      </div>
    )
  }

  renderTagList () {
    const { snippet } = this.props
    const { isEditing } = this.state
    return (
      <div className='tag-list'>
        <span className='icon'>
          <FAIcon icon='tags' />
        </span>
        {
          isEditing
            ? <input
              type='text'
              ref='tags'
              defaultValue={snippet.tags.join(', ')} />
            : snippet.tags.join(', ')
        }
      </div>
    )
  }

  renderDescription () {
    const { snippet } = this.props
    const { isEditing } = this.state
    return (
      <div className={`description ${isEditing ? 'editing' : ''}`}>
        {
          isEditing
            ? <textarea
              ref='description'
              defaultValue={snippet.description}>
            </textarea>
            : snippet.description
        }
      </div>
    )
  }

  renderFooter () {
    const { snippet, config } = this.props
    return (
      <div className='footer'>
        <div className='info-left'>
          {
            config.ui.showSnippetCreateTime &&
            <span className='createAt'>
              { i18n.__('Create at') } : { formatDate(snippet.createAt) }
            </span>
          }
          {
            config.ui.showSnippetUpdateTime &&
            <span className='updateAt'>
              { i18n.__('Last update') } : { formatDate(snippet.updateAt) }
            </span>
          }
        </div>
        <div className='info-right'>
          {
            config.ui.showSnippetCopyCount &&
            <span className='copyCount'>
              { i18n.__('Copy') } : { snippet.copy } { i18n.__('times') }
            </span>
          }
        </div>
      </div>
    )
  }

  renderFileList () {
    const { snippet } = this.props
    const { selectedFile, isEditing } = this.state
    const files = snippet.files
    return (
      <div className='file-list' ref='fileList'>
        <ul>
          {
            files.map((file, index) =>
              <li
                key={file.key}
                onClick={() => this.handleChangeFileClick(index)}
                className={index === selectedFile ? 'selected' : ''}>
                {
                  isEditing
                    ? <input
                      type='text'
                      className='fileName'
                      defaultValue={file.name} />
                    : file.name
                }
                {
                  !isEditing &&
                    <span
                      className='icon'
                      onClick={e => this.handleDeleteFile(e, index)}>
                      <FAIcon icon='trash-alt' />
                    </span>
                }
              </li>
            )
          }
          {
            isEditing &&
            <li>
              <input
                type='text'
                ref='newFile'
                onFocus={this.handleNewFileFocus.bind(this)}
                placeholder='New file'/>
            </li>
          }
        </ul>
      </div>
    )
  }

  handleDeleteFile (event, fileIndex) {
    event.stopPropagation()
    const { snippet, store } = this.props
    const newSnippet  = _.clone(snippet)
    newSnippet.files.splice(fileIndex, 1)
    store.updateSnippet(newSnippet)
    this.refs.fileList.style.maxHeight = '0px'
    this.applyEditorStyle()
    // reset height
    setTimeout(() => {
      this.refs.fileList.style.maxHeight = '300px'
      this.applyEditorStyle()
    })
  }

  handleNewFileFocus () {
    const fileList = this.refs.fileList.querySelector('ul')
    const newLI = document.createElement('li')
    const newInput = document.createElement('input')
    newInput.type = 'text'
    newInput.className = 'fileName newFile'
    newLI.appendChild(newInput)
    fileList.insertBefore(newLI, fileList.lastChild)
    newInput.focus()
    // remove newly added file if the user click outside and its name is empty
    newInput.addEventListener('blur', () => {
      if (!newInput.value) {
        newInput.parentElement.remove()
      }
    })
    this.applyEditorStyle()
  }

  handleChangeFileClick (index) {
    const { snippet } = this.props
    const { isEditing } = this.state
    if (!isEditing) {
      this.setState({ selectedFile: index }, () => {
        const file = snippet.files[index]
        const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
        const snippetMode = CodeMirror.findModeByExtension(fileExtension).mode
        if (snippetMode === 'htmlmixed') {
          require(`codemirror/mode/xml/xml`)
          this.editor.setOption('mode', 'xml')
          this.editor.setOption('htmlMode', true)
        } else {
          require(`codemirror/mode/${snippetMode}/${snippetMode}`)
          this.editor.setOption('mode', snippetMode)
        }
        this.editor.setValue(snippet.files[index].value)
      })
    }
  }

  render () {
    return (
      <div className='snippet-item-multi-files' ref='root'>
        <ReactTooltip place='bottom' effect='solid' />
        { this.renderHeader() }
        { this.renderTagList() }
        { this.renderDescription() }
        <div className='inline'>
          { this.renderFileList() }
          <div className='code' ref='editor'></div>
        </div>
        { this.renderFooter() }
      </div>
    )
  }
}
