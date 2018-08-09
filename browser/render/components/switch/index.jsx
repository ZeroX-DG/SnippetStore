import React from 'react'
import './switch.sass'

export default class Switch extends React.Component {
  render () {
    return (
      <label className="switch">
        <input
          type="checkbox"
          onChange={e => this.props.onChange(e.target.checked)}
          defaultChecked={this.props.defaultValue}
        />
        <span className="slider round" />
      </label>
    )
  }
}
