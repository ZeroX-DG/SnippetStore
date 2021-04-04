import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import eventEmitter from 'lib/event-emitter'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import TagInput from 'render/components/tag-input'
import _ from 'lodash'
import { getExtension, generateKey } from 'lib/util'
import { trackEvent } from 'lib/analytics'
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
    this.editor = CodeMirror(this.refs.editor, {
      autoRefresh: true
    })
    this.editor.setSize('100%', '100%')

    this.editor.on('change', () => {
      this.handleEditingFileValueChange()
    })
    this.applyEditorStyle()

    eventEmitter.on('modal:onClose', (event, name) => {
      if (name === this.state.name) {
        this.reset()
      }
    })
    trackEvent('user interaction', 'create snippet', 'multi-file')
    eventEmitter.on('snippets:saveAll', this.createSnippet.bind(this))
  }

  componentWillUnmount () {
    eventEmitter.off('snippets:saveAll', this.createSnippet.bind(this))
  }

  componentWillReceiveProps (props) {
    this.applyEditorStyle(props)
  }

  applyEditorStyle (props) {
    const { config } = props || this.props
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
    scrollElement.style.maxHeight = '200px'
    const FileList = this.refs.fileList
    scrollElement.style.minHeight = `${FileList.clientHeight}px`
    this.editor.refresh()

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
      if (snippetMode === 'null') {
        this.editor.setOption('mode', 'null')
        this.editor.setOption('htmlMode', false)
        return
      }
      require(`codemirror/mode/${snippetMode}/${snippetMode}`)
    }
  }

  createSnippet () {
    const snippetName = this.refs.snippetName.value
    const snippetDescription = this.refs.description.value
    // wrappedInstance is mobX wrapped instance of the original component
    const snippetTags = this.tags.wrappedInstance.getTags()
    const { files } = this.state

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
      tags: snippetTags,
      files
    })
    eventEmitter.emit('modal:close')
  }

  renderFileList () {
    const { selectedFile, files } = this.state
    return (
      <div className="file-list" ref="fileList">
        <ul>
          {files.map((file, index) => (
            <li
              key={file.key}
              onClick={() => this.handleChangeFileClick(index)}
              className={index === selectedFile ? 'selected' : ''}
            >
              {
                <input
                  type="text"
                  className="fileName"
                  onChange={e => this.handleEditingFileNameChange(e, index)}
                  defaultValue={file.name}
                />
              }
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
          {
            <li>
              <input
                type="text"
                ref="newFile"
                onFocus={this.handleNewFileFocus.bind(this)}
                placeholder={i18n.__('New file')}
              />
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
  }

  handleChangeFileClick (index, useFileAtIndex) {
    const { files } = this.state
    // set the new selected file index
    this.setState({ selectedFile: index }, () => {
      // if the snippet is in the editing mode, interact with the state instead
      // of the snippet in prop
      // Sometime, we want the current index file to change but use the content
      // of another file (look at the function above)
      const fileIndex = useFileAtIndex || index
      const file = files[fileIndex]
      // first time loaded there is no file
      if (file) {
        // if the mode for that language exists then use it otherwise use text
        this.applyEditorLanguage(file.name)
        this.editor.setValue(file.value)
      } else {
        this.editor.setValue('')
      }
    })
  }

  applyEditorLanguage (filename) {
    const { config } = this.props
    const langConf = config.language
    const fileExtension = getExtension(filename)
    const resultMode = CodeMirror.findModeByExtension(fileExtension)
    if (resultMode) {
      const snippetMode = resultMode.mode
      if (snippetMode === 'null') {
        this.editor.setOption('mode', 'null')
        this.editor.setOption('htmlMode', false)
      } else if (snippetMode === 'htmlmixed') {
        require(`codemirror/mode/xml/xml`)
        this.editor.setOption('mode', 'xml')
        this.editor.setOption('htmlMode', true)
      } else if (snippetMode === 'sql') {
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        this.editor.setOption('mode', 'text/x-sql')
      } else if (snippetMode === 'php') {
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        this.editor.setOption('mode', {
          name: 'php',
          startOpen: !langConf.php.requireOpenTag
        })
      } else {
        require(`codemirror/mode/${snippetMode}/${snippetMode}`)
        this.editor.setOption('mode', snippetMode)
      }
    } else {
      this.editor.setOption('mode', 'null')
    }
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
      const input = inputs[inputs.length - 2].querySelector('input')
      this.handleChangeFileClick(newEditingFiles.length - 1)
      input.focus()
    })
    this.applyEditorStyle()
  }

  handleEditingFileValueChange () {
    const { selectedFile, files } = this.state
    const newEditingFiles = _.clone(files)
    if (files.length > 0 && newEditingFiles[selectedFile]) {
      newEditingFiles[selectedFile].value = this.editor.getValue()
      this.setState({ files: newEditingFiles })
    }
  }

  handleEditingFileNameChange (event, index) {
    const { files } = this.state
    const newEditingFiles = _.clone(files)
    const name = event.target.value
    newEditingFiles[index].name = name
    this.applyEditorLanguage(name)
    this.setState({ files: newEditingFiles })
  }

  render () {
    const { config } = this.props
    i18n.setLocale(config.ui.language)
    return (
      <ModalSkeleton name={this.state.name}>
        <div className="create-multi-file-snippet">
          <h2 className="modal-title">{i18n.__('Create snippet')}</h2>
          <div className="modal-content">
            <p className="error">{this.state.error}</p>
            <div className="input-group">
              <label>{i18n.__('Snippet name')}</label>
              <input type="text" ref="snippetName" />
            </div>
            <div className="code-input-group">
              <label>{i18n.__('Tags')}</label>
              <TagInput
                ref={ref => (this.tags = ref)}
                color={config.ui.tagColor}
              />
            </div>
            <div className="code-input-group">
              <label>{i18n.__('Snippet description')}</label>
              <textarea ref="description" />
            </div>
            <div className="code-input-group">
              <label>{i18n.__('Snippet content')}</label>
              <div className="inline">
                {this.renderFileList()}
                <div className="code" ref="editor" />
              </div>
            </div>
            <button
              className="float-right"
              onClick={this.createSnippet.bind(this)}
            >
              {i18n.__('Create')}
            </button>
          </div>
        </div>
      </ModalSkeleton>
    )
  }
}
