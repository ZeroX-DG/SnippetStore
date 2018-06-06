import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import eventEmitter from 'lib/event-emitter'
import './setting'

import InterfaceTab from './tabs/interface'

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
    switch(tab) {
      case 'interface':
        return <InterfaceTab />
    }
  }

  renderTabList () {
    return (
      <ul>
        <li className='active'>
          <div className='tab'>Interface</div>
        </li>
        <li>
          <div className='tab'>Interface</div>
        </li>
      </ul>
    )
  }

  render () {
    return (
      <ModalSkeleton name='settingModal'>
        <div className='modal-content'>
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
