import React from 'react'
import { getLanguages } from 'render/lib/languages'

export default class InterfaceTab extends React.Component {
  saveSetting () {
    const newSetting = {
      ui: {
        theme: this.refs.theme.value,
        dateFormat: this.refs.dateFormat.value,
        language: this.refs.language.value,
        showCopyNoti: this.refs.showCopyNoti.checked,
        showDeleteConfirmDialog: this.refs.showDeleteConfirmDialog.checked,
        showSnippetCreateTime: this.refs.showSnippetCreateTime.checked,
        showSnippetUpdateTime: this.refs.showSnippetUpdateTime.checked,
        showSnippetCopyCount: this.refs.showSnippetCopyCount.checked
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
    const { theme }  = config.ui
    const languages  = getLanguages()
    return (
      <div className='interface-tab'>
        <h1 className='tab-title'>Interface</h1>
        <div className='middle-content'>
          <div className='group'>
            <label>Theme</label>
            <select ref='theme' defaultValue={theme}>
              <option value='dark'>Dark</option>
              <option value='light'>Light</option>
            </select>
          </div>
          <div className='group'>
            <label>Language</label>
            <select ref='language' defaultValue={config.ui.language}>
              {
                languages.map(language => <option value={language.code}>{language.name}</option>)
              }
            </select>
          </div>
          <div className='group-checkbox'>
            <label>
              <input
                type='checkbox'
                ref='showCopyNoti'
                defaultChecked={config.ui.showCopyNoti} />
              Show notification when copy
            </label>
          </div>
          <div className='group-checkbox'>
            <label>
              <input
                type='checkbox'
                ref='showDeleteConfirmDialog'
                defaultChecked={config.ui.showDeleteConfirmDialog}/>
              Show confirm dialog when delete
            </label>
          </div>
          <div className='group-checkbox'>
            <label>
              <input
                type='checkbox'
                ref='showSnippetCreateTime'
                defaultChecked={config.ui.showSnippetCreateTime}/>
              Show snippet create time
            </label>
          </div>
          <div className='group-checkbox'>
            <label>
              <input
                type='checkbox'
                ref='showSnippetUpdateTime'
                defaultChecked={config.ui.showSnippetUpdateTime}/>
              Show snippet update time
            </label>
          </div>
          <div className='group-checkbox'>
            <label>
              <input
                type='checkbox'
                ref='showSnippetCopyCount'
                defaultChecked={config.ui.showSnippetCopyCount}/>
              Show snippet copy count
            </label>
          </div>
          <div className='group'>
            <label>Date format</label>
            <input type='text' ref='dateFormat' defaultValue={config.ui.dateFormat}/>
          </div>
        </div>
        <div className='bottom-tool'>
          <label className='message success hide'>Interface setting saved</label>
          <button>Save</button>
        </div>
      </div>
    )
  }
}
