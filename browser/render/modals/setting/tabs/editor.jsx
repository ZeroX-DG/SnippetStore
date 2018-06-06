import React from 'react'
import CodeMirror from 'codemirror'
import ConfigManager from 'lib/config-manager'
import 'codemirror/mode/javascript/javascript'
import consts from 'render/lib/consts'

export default class EditorTab extends React.Component {
  componentDidMount () {
    const { config } = this.props
    const { showLineNumber, theme } = config.editor
    const sampleCode = `const number = 1
if (number == 1) {
  console.log(number * 2)
} else {
  console.log(number)
}`
    this.editor = CodeMirror(this.refs.themePreview, {
      value: sampleCode,
      readOnly: true,
      lineNumbers: showLineNumber,
      mode: 'javascript',
      theme: theme,
      foldGutter: showLineNumber,
      gutters: showLineNumber ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'] : []
    })

    const spans = document.querySelectorAll('span[class^=\'cm-\']')
    spans.forEach(span => span.style.fontFamily = config.editor.fontFamily)

    this.editor.setSize('100%', '100%')
  }

  previewEditorLineNumberChange () {
    this.editor.setOption('lineNumbers', this.refs.showLineNumber.checked)
    this.editor.setOption('foldGutter', this.refs.showLineNumber.checked)
    this.editor.setOption('gutters', this.refs.showLineNumber.checked ? ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'] : [])
  }

  previewEditorThemeChange () {
    const newTheme = this.refs.themeSelector.value
    require(`codemirror/theme/${newTheme}.css`)
    this.editor.setOption('theme', newTheme)
  }

  saveSetting () {
    const newSetting = {
      editor: {
        showLineNumber: this.refs.showLineNumber.checked,
        theme: this.refs.themeSelector.value,
        fontFamily: this.refs.fontFamily.value,
        fontSize: this.refs.fontSize.value,
        indentUsingTab: this.refs.indentStyle.value === 'tab',
        tabSize: this.refs.tabSize.value
      }
    }

    ConfigManager.set(newSetting)
    this.refs.message.classList.remove('hide')
    setTimeout(() => {
      this.refs.message.classList.add('hide')
    }, 2000)
  }

  render () {
    const { config } = this.props
    const editorConf = config.editor
    return (
      <div className='editor-tab'>
        <h1 className='tab-title'>Editor</h1>
        <div className='middle-content'>
          <div className='group-checkbox'>
            <label>
              <input
                type='checkbox'
                defaultChecked={editorConf.showLineNumber} 
                onChange={this.previewEditorLineNumberChange.bind(this)}
                ref='showLineNumber'/>
                Show line number
              </label>
          </div>
          <div className='input-group'>
            <label>Theme</label>
            <select ref='themeSelector' onChange={this.previewEditorThemeChange.bind(this)} defaultValue={config.editor.theme}>
              {
                consts.EDITOR_THEMES.map((theme, index) => (
                  <option value={theme} key={index}>{theme}</option>
                ))
              }
            </select>
            <div className='theme-preview' ref='themePreview'></div>
          </div>
          <div className='input-group'>
            <label>Editor font family</label>
            <input type='text' defaultValue={editorConf.fontFamily} ref='fontFamily' />
          </div>
          <div className='input-group'>
            <label>Editor font size</label>
            <input type='number' defaultValue={editorConf.fontSize} ref='fontSize' />
          </div>
          <div className='input-group'>
            <label>Editor indent style</label>
            <select defaultValue={editorConf.indentUsingTab ? 'tab' : 'space'} ref='indentStyle'>
              <option value='tab'>Tab</option>
              <option value='space'>Space</option>
            </select>
          </div>
          <div className='input-group'>
            <label>Editor tab size</label>
            <input type='number' defaultValue={editorConf.tabSize} ref='tabSize'/>
          </div>
        </div>
        <div className='bottom-tool'>
          <label className='message success hide' ref='message'>Editor setting saved</label>
          <button onClick={this.saveSetting.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
