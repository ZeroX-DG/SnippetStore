import React from 'react'
import { ToastContainer } from 'react-toastify'
import SideBar from './components/side-bar'
import ModalList from './modals/modal-list'
import CM from 'lib/config-manager'
import eventEmitter from 'lib/event-emitter'
import init from 'core/init'
import applyShortcut from 'core/functions/keyboard'
import i18n from 'render/lib/i18n'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'
import MainAreaOriginal from './layouts/original/main-area'
import MainAreaListAndDetail from './layouts/list-and-detail/main-area'

import { trackEvent, pageView } from 'lib/analytics'

const messenger = require('messenger')
const electron = require('electron')
const { ipcRenderer } = electron

const server = messenger.createListener(2041)

@inject('store')
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

    eventEmitter.on('storage:update', () => {
      init()
    })

    server.on('transferCode', (message, data) => {
      eventEmitter.emit('modal:openWithData', {
        name: 'createSnippetModal',
        data
      })
      ipcRenderer.send('bringToFront', true)
    })

    server.on('getSnippets', message => {
      const snippets = toJS(this.props.store.rawSnippets)
      message.reply({ snippets })
    })

    this.setUpDropFile()

    pageView('/')
  }

  renderMainArea () {
    const { config } = this.state
    const { layout } = config.ui
    switch (layout) {
      case 'original':
        trackEvent('user layout', 'use original')
        return <MainAreaOriginal config={config} />
      case 'list-and-detail':
        trackEvent('user layout', 'use list-and-detail')
        return <MainAreaListAndDetail config={config} />
      default:
        return <MainAreaOriginal config={config} />
    }
  }

  setUpDropFile () {
    const holder = this.refs.wrapper

    holder.ondragover = () => false

    holder.ondragleave = () => false

    holder.ondragend = () => false

    holder.ondrop = e => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files && files[0]) {
        const path = files[0].path
        eventEmitter.emit('snippet:import', path)
      }

      return false
    }
  }

  render () {
    const { config } = this.state
    return (
      <div className="wrapper" ref="wrapper">
        <ToastContainer />
        <ModalList config={config} />
        <SideBar config={config} />
        {this.renderMainArea()}
      </div>
    )
  }
}
