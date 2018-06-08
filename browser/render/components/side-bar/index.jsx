import React from 'react'
import './side-bar'
import eventEmitter from 'lib/event-emitter'
import LanguageList from '../language-list'
import SideBarToolBox from '../side-bar-toolbox'

export default class SideBar extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    eventEmitter.on('sidebar:toggle', () => {
      if (this.refs.root.classList.contains('small')) {
        this.refs.root.classList.remove('small')
        const newSize = 300
        eventEmitter.emit('sidebar:toggled', newSize)
      } else {
        this.refs.root.classList.add('small')
        const newSize = 70
        eventEmitter.emit('sidebar:toggled', newSize)
      }
    })
  }

  render () {
    return (
      <div className='sidebar' ref='root'>
        <SideBarToolBox />
        <LanguageList store={this.props.store} />
      </div>
    )
  }
}
