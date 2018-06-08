import React from 'react'
import eventEmitter from 'lib/event-emitter'
import FAIcon from '@fortawesome/react-fontawesome'
import './side-bar-toolbox'

export default class SideBarToolBox extends React.Component {
  handleSettingClick () {
    eventEmitter.emit('modal:open', 'settingModal')
  }

  render () {
    return (
      <div className='sidebar-toolbox'>
        <h3 className='logo'>
          <span className='logo-text'>SnippetStore</span>
          <span className='icon' onClick={this.handleSettingClick}>
            <FAIcon icon='cog' />
          </span>
        </h3>
      </div>
    )
  }
}
