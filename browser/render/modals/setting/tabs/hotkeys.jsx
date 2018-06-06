import React from 'react'
import ConfigManager from 'lib/config-manager'

export default class HotKeysTab extends React.Component {
  saveSetting () {
    const newSetting = {
      keyboard: {
        createSnippet: this.refs.createSnippet.value,
        openSetting: this.refs.openSetting.value
      }
    }

    ConfigManager.set(newSetting)
    this.refs.message.classList.remove('hide')
    setTimeout(() => {
      this.refs.message.classList.add('hide')
    }, 2000)
  }

  render () {
    const { keyboard } = this.props.config
    return (
      <div className='hotkeys-tab'>
        <h1 className='tab-title'>HotKeys</h1>
        <div className='middle-content'>
          <div className='input-group'>
            <label>Create snippet</label>
            <input type='text' defaultValue={keyboard.createSnippet} ref='createSnippet' />
          </div>
          <div className='input-group'>
            <label>Open setting</label>
            <input type='text' defaultValue={keyboard.openSetting} ref='openSetting' />
          </div>
        </div>
        <div className='bottom-tool'>
          <label className='message success hide' ref='message'>Hotkeys setting saved</label>
          <button onClick={this.saveSetting.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
