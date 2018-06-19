import React from 'react'
import SearchSnippetBar from '../search-snippet-bar'
import SnippetList from '../snippet-list'
import MainAreaToolBox from '../main-area-toolbox'
import eventEmitter from 'lib/event-emitter'
import './main-area'

export default class MainArea extends React.Component {
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
    const { store, config } = this.props
    return (
      <div className='main-area' ref='root'>
        <SearchSnippetBar store={store} />
        <MainAreaToolBox store={store} />
        <SnippetList store={store} config={config} />
      </div>
    )
  }
}
