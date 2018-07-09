import React from 'react'
import eventEmitter from 'lib/event-emitter'
import './tag-item'

export default class TagItem extends React.Component {
  handleTagClick () {
    const { tag } = this.props
    eventEmitter.emit('tag:click', tag)
  }

  render () {
    const { tag } = this.props
    return (
      <span className="tag-item" onClick={() => this.handleTagClick()}>
        #{tag}
      </span>
    )
  }
}
