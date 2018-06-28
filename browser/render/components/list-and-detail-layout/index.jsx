import React from 'react'
import eventEmitter from 'lib/event-emitter'
import './list-and-detail-layout'

export default class ListAndDetailLayout extends React.Component {
  componentDidMount () {
    eventEmitter.on('languageList:pickLang', (event, language) => {
      const newKeyword = `lang:${language}`
      this.refs.search.value = newKeyword
      this.handleSearch(newKeyword)
    })

    eventEmitter.on('taglist:pickTag', (event, tag) => {
      const newKeyword = `#${tag}`
      this.refs.search.value = newKeyword
      this.handleSearch(newKeyword)
    })

    eventEmitter.on('sidebar:toggled', (event, newSize) => {
      this.refs.root.style.width = `calc(100% - ${newSize}px)`
    })
  }

  render () {
    return <div className="list-and-detail" ref="root" />
  }
}
