import React from 'react'
import SearchSnippetBar from '../search-snippet-bar'
import SnippetList from '../snippet-list'
import MainAreaToolBox from '../main-area-toolbox'
import eventEmitter from 'lib/event-emitter'
import { inject } from 'mobx-react'
import './main-area'

@inject('store')
export default class MainArea extends React.Component {
  componentDidMount () {
    eventEmitter.on('sidebar:toggled', (event, newSize) => {
      if (this.refs.root) {
        this.refs.root.style.width = `calc(100% - ${newSize}px)`
      }
    })

    eventEmitter.emit('sidebar:getSize')
  }

  render () {
    const { store, config } = this.props
    return (
      <div className="main-area" ref="root">
        <SearchSnippetBar store={store} />
        <MainAreaToolBox store={store} />
        <SnippetList store={store} config={config} />
      </div>
    )
  }
}
