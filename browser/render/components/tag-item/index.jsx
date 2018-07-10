import React from 'react'
import eventEmitter from 'lib/event-emitter'
import './tag-item'

export default class TagItem extends React.Component {
  handleTagClick () {
    const { tag, notClickAble } = this.props
    if (!notClickAble) {
      eventEmitter.emit('tag:click', tag)
    }
  }

  render () {
    const { tag, config } = this.props
    return (
      <span
        className="tag-item"
        style={{
          background: config.ui.tagColor.background,
          color: config.ui.tagColor.foreground
        }}
        onClick={() => this.handleTagClick()}
      >
        #{tag}
      </span>
    )
  }
}
