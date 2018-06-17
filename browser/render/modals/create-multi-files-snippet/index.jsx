import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import eventEmitter from 'lib/event-emitter'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import { getExtension, generateKey } from 'lib/util'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'
import './create-multi-file-snippet'

export default class CreateMultiFilesSnippetModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      error: '',
      name: 'createMultiFilesSnippetModal',
      selectedFile: 0,
      files: []
    }
  }

  componentDidMount () {
    const { config } = this.props
    const { showLineNumber, theme } = config.editor
    this.editor = CodeMirror(this.refs.editor, {
      lineNumbers: showLineNumber,
      theme: theme,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      autoRefresh: true
    })

    this.editor.on('change', () => {
      this.handleEditingFileValueChange()
    })
    this.applyEditorStyle()

    eventEmitter.on('modal:onClose', (event, name) => {
      if (name === this.state.name) {
        this.reset()
      }
    })
  }

  applyEditorStyle () {
    const { config } = this.props
    const { selectedFile, files } = this.state
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

    const totalSnippets = files.length
    const file = files[selectedFile]
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

  createSnippet () {
    const snippetName        = this.refs.snippetName.value
    const snippetDescription = this.refs.description.value
    const { files }          = this.state

    if (!snippetName) {
      this.setState({
        error: 'Please specify at least snippet name'
      })
      return
    }

    if (files.length < 1) {
      this.setState({
        error: 'Multi file snippet must have at least 1 file'
      })
      return
    }

    this.props.store.createSnippet({
      name: snippetName,
      description: snippetDescription,
      files
    })
    this.reset()
    eventEmitter.emit('modal:close', this.state.name)
  }

  reset () {
    this.refs.snippetName.value  = ''
    this.refs.description.value  = ''
    this.setState({ files: [], selectedFile: 0, error: '' }, () => {
      this.editor.setValue('')
    })
  }

  renderFileList () {
    const { selectedFile, files } = this.state
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
                  <input
                    type='text'
                    className='fileName'
                    onChange={e => this.handleEditingFileNameChange(e, index)}
                    defaultValue={file.name} />
                }
                {
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
    const { files, selectedFile } = this.state
    const newEditingFiles = _.clone(files)
    newEditingFiles.splice(fileIndex, 1)
    this.setState({ files: newEditingFiles })
    // prevent reading deleted snippet
    if (selectedFile > files.length - 1) {
      this.handleChangeFileClick(files.length - 1, () => {
        this.resetSnippetHeight()
      })
    }
  }

  handleChangeFileClick (index, callback) {
    const { files } = this.state
    console.log(index)
    // set the new selected file index
    this.setState({ selectedFile: index }, () => {
      // if the snippet is in the editing mode, interact with the state instead
      // of the snippet in prop
      if (index !== -1) {
        const file = files[index]
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
        if (callback && typeof callback === 'function') {
          callback()
        }
      }
    })
  }

  handleNewFileFocus () {
    const { files } = this.state
    // make a clone of the current editing file list
    const newEditingFiles = _.clone(files)
    // push a new file to the list
    newEditingFiles.push({ key: generateKey(), name: '', value: '' })
    this.setState({ files: newEditingFiles }, () => {
      // a new input tag will automatically created after set state and we want
      // to focus on that input tag
      const inputs = this.refs.fileList.firstChild.childNodes
      const input  = inputs[inputs.length - 2].querySelector('input')
      this.handleChangeFileClick(newEditingFiles.length - 1)
      input.focus()
    })
    this.applyEditorStyle()
  }

  handleEditingFileValueChange () {
    const { selectedFile, files } = this.state
    if (files.length > 0) {
      const newEditingFiles = _.clone(files)
      newEditingFiles[selectedFile].value = this.editor.getValue()
      this.setState({ files: newEditingFiles })
    }
  }

  handleEditingFileNameChange (event, index) {
    const { files } = this.state
    const newEditingFiles  = _.clone(files)
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
    this.setState({ files: newEditingFiles })
  }

  render () {
    i18n.setLocale(this.props.config.ui.language)
    return (
      <ModalSkeleton name={this.state.name}>
        <div className='create-multi-file-snippet'>
          <h2 className='modal-title'>{ i18n.__('Create snippet') }</h2>
          <div className='modal-content'>
            <p className='error'>{this.state.error}</p>
            <div className='input-group'>
              <label>{ i18n.__('Snippet name') }</label>
              <input type='text' ref='snippetName' />
            </div>
            <div className='code-input-group'>
              <label>{ i18n.__('Snippet description') }</label>
              <textarea ref='description'></textarea>
            </div>
            <div className='code-input-group'>
              <label>{ i18n.__('Snippet content') }</label>
              <div className='inline'>
                {this.renderFileList()}
                <div className='code' ref='editor'></div>
              </div>
            </div>
            <button
              className='float-right'
              onClick={this.createSnippet.bind(this)}>
              { i18n.__('Create') }
            </button>
          </div>
        </div>
      </ModalSkeleton>
    )
  }
}
