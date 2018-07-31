import React from 'react'
import { ToastContainer } from 'react-toastify'
import SideBar from './components/side-bar'
import ModalList from './modals/modal-list'
import CM from 'lib/config-manager'
import eventEmitter from 'lib/event-emitter'
import init from 'core/init'
import applyShortcut from 'core/functions/keyboard'
import i18n from 'render/lib/i18n'

import MainAreaOriginal from './layouts/original/main-area'
import MainAreaListAndDetail from './layouts/list-and-detail/main-area'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      config: CM.get()
    }
  }

  componentDidMount () {
    const { config } = this.state
    require(`codemirror/theme/${config.editor.theme}.css`)
    document.body.setAttribute('data-theme', config.ui.theme)
    i18n.setLocale(config.ui.language)
    init()
    applyShortcut(config.keyboard)
    eventEmitter.on('config:set', (event, config) => {
      this.setState({ config })
      document.body.setAttribute('data-theme', config.ui.theme)
      i18n.setLocale(config.ui.language)
    })
  }

  renderMainArea () {
    const { config } = this.state
    const { layout } = config.ui
    switch (layout) {
      case 'original':
        return <MainAreaOriginal config={config} />
      case 'list-and-detail':
        return <MainAreaListAndDetail config={config} />
      default:
        return <MainAreaOriginal config={config} />
    }
  }

  render () {
    const { config } = this.state
    return (
      <div className="wrapper">
        <ToastContainer />
        <ModalList config={config} />
        <SideBar config={config} />
        {this.renderMainArea()}
      </div>
    )
  }
}
