import React from 'react'
import { ToastContainer } from 'react-toastify'
import SideBar from './components/side-bar'
import MainArea from './layouts/original/main-area'
import ModalList from './modals/modal-list'
import SnippetStore from 'store/SnippetStore'
import CM from 'lib/config-manager'
import eventEmitter from 'lib/event-emitter'
import init from 'core/init'
import applyShortcut from 'core/functions/keyboard'
import i18n from 'render/lib/i18n'

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

  render () {
    const { config } = this.state
    return (
      <div className="wrapper">
        <ToastContainer />
        <ModalList store={SnippetStore} config={config} />
        <SideBar store={SnippetStore} config={config} />
        <MainArea store={SnippetStore} config={config} />
      </div>
    )
  }
}
