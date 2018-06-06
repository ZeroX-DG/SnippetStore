import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import eventEmitter from 'lib/event-emitter'
import './setting'

import InterfaceTab from './tabs/interface'
import EditorTab from './tabs/editor'

export default class SettingModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'interface'
    }
  }

  reset () {
  }

  renderTab () {
    const { tab } = this.state
    const { config } = this.props
    switch(tab) {
      case 'interface':
        return <InterfaceTab config={config} />
      case 'editor':
        return <EditorTab config={config} />
    }
  }

  switchTab (tab) {
    this.setState({ tab })
  }

  renderTabList () {
    const { tab } = this.state
    return (
      <ul>
        <li
          onClick={() => this.switchTab('interface')}
          className={tab === 'interface' ? 'active' : ''}>
          <div className='tab'>Interface</div>
        </li>
        <li
          onClick={() => this.switchTab('editor')}
          className={tab === 'editor' ? 'active' : ''}>
          <div className='tab'>Editor</div>
        </li>
        <li
          onClick={() => this.switchTab('about')}
          className={tab === 'about' ? 'active' : ''}>
          <div className='tab'>About</div>
        </li>
      </ul>
    )
  }

  render () {
    return (
      <ModalSkeleton name='settingModal'>
        <div className='modal-content setting'>
          <div className='tab-list'>
            {
              this.renderTabList()
            }
          </div>
          <div className='tab-content'>
            {
              this.renderTab()
            }
          </div>
        </div>
      </ModalSkeleton>
    )
  }
}
