import React from 'react'
import SnippetList from '../snippet-list'
import SnippetDetailWrapper from '../snippet-detail-wrapper'
import eventEmitter from 'lib/event-emitter'
import './main-area'

export default class MainArea extends React.Component {
  componentDidMount () {
    eventEmitter.on('sidebar:toggled', (event, newSize) => {
      this.refs.root.style.width = `calc(100% - ${newSize}px)`
    })
  }

  render () {
    const { store, config } = this.props
    return (
      <div className="main-area" ref="root">
        <SnippetList store={store} config={config} />
        <SnippetDetailWrapper store={store} config={config} />
      </div>
    )
  }
}
