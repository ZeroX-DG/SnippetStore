import React from 'react'
import './tag-item'

export default class TagItem extends React.Component {
  render () {
    const { tag } = this.props
    return <div className="tag-item">#{tag}</div>
  }
}
