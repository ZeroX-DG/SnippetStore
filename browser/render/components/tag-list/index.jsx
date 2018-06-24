import React from 'react'
import { observer } from 'mobx-react'
import eventEmitter from 'lib/event-emitter'
import i18n from 'render/lib/i18n'
import './tag-list'

@observer
export default class TagList extends React.Component {
  handleTagClick (tag) {
    eventEmitter.emit('taglist:pickTag', tag)
  }

  render () {
    const { tags } = this.props.store
    return (
      <div className="tag-list">
        <div className="tag-list-label">
          {i18n.__('TAGS')}
          <div className="badge">{Object.keys(tags).length}</div>
        </div>
        <ul className="tags">
          {Object.keys(tags).map((tag, index) => (
            <li key={index} onClick={() => this.handleTagClick(tag)}>
              <div className="tag-name">#{tag}</div>
              <div className="badge">{tags[tag]}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
