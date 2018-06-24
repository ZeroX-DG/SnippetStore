import React from 'react'
import './side-bar'
import eventEmitter from 'lib/event-emitter'
import LanguageList from '../language-list'
import SideBarToolBox from '../side-bar-toolbox'
import TagList from '../tag-list'
import ConfigManager from 'lib/config-manager'

export default class SideBar extends React.Component {
  componentDidMount () {
    if (ConfigManager.get('ui->smallSidebar')) {
      eventEmitter.emit('sidebar:toggled', 70)
    } else {
      eventEmitter.emit('sidebar:toggled', 300)
    }
    eventEmitter.on('sidebar:toggle', () => {
      if (this.refs.root.classList.contains('small')) {
        this.refs.root.classList.remove('small')
        ConfigManager.set({ ui: { smallSidebar: false } })
        const newSize = 300
        eventEmitter.emit('sidebar:toggled', newSize)
      } else {
        this.refs.root.classList.add('small')
        ConfigManager.set({ ui: { smallSidebar: true } })
        const newSize = 70
        eventEmitter.emit('sidebar:toggled', newSize)
      }
    })
  }

  render () {
    const { config, store } = this.props
    return (
      <div
        className={`sidebar ${config.ui.smallSidebar ? 'small' : ''}`}
        ref="root"
      >
        <SideBarToolBox />
        <TagList store={store} config={config} />
        <LanguageList store={store} config={config} />
      </div>
    )
  }
}
