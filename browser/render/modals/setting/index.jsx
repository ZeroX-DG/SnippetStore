import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import i18n from 'render/lib/i18n'
import './setting'

import InterfaceTab from './tabs/interface'
import EditorTab from './tabs/editor'
import HotKeysTab from './tabs/hotkeys'
import About from './tabs/about'
import StorageTab from './tabs/storage'
import LanguageTab from './tabs/language'

export default class SettingModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'interface'
    }
  }

  renderTab () {
    const { tab } = this.state
    const { config } = this.props
    switch (tab) {
      case 'interface':
        return <InterfaceTab config={config} />
      case 'editor':
        return <EditorTab config={config} />
      case 'hotkeys':
        return <HotKeysTab config={config} />
      case 'about':
        return <About config={config} />
      case 'storage':
        return <StorageTab config={config} />
      case 'language':
        return <LanguageTab config={config} />
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
          className={tab === 'interface' ? 'active' : ''}
        >
          <div className="tab">{i18n.__('Interface')}</div>
        </li>
        <li
          onClick={() => this.switchTab('editor')}
          className={tab === 'editor' ? 'active' : ''}
        >
          <div className="tab">{i18n.__('Editor')}</div>
        </li>
        <li
          onClick={() => this.switchTab('hotkeys')}
          className={tab === 'hotkeys' ? 'active' : ''}
        >
          <div className="tab">{i18n.__('Hotkeys')}</div>
        </li>
        <li
          onClick={() => this.switchTab('about')}
          className={tab === 'about' ? 'active' : ''}
        >
          <div className="tab">{i18n.__('About')}</div>
        </li>
        <li
          onClick={() => this.switchTab('storage')}
          className={tab === 'storage' ? 'active' : ''}
        >
          <div className="tab">{i18n.__('Storage')}</div>
        </li>
        <li
          onClick={() => this.switchTab('language')}
          className={tab === 'language' ? 'active' : ''}
        >
          <div className="tab">{i18n.__('Programming Language')}</div>
        </li>
      </ul>
    )
  }

  render () {
    i18n.setLocale(this.props.config.ui.language)
    return (
      <ModalSkeleton name="settingModal">
        <div className="modal-content setting">
          <div className="tab-list">{this.renderTabList()}</div>
          <div className="tab-content">{this.renderTab()}</div>
        </div>
      </ModalSkeleton>
    )
  }
}
