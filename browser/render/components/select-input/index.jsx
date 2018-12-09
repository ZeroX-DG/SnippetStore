import React from 'react'
import './select-input'

class SelectInput extends React.PureComponent {
  state = {
    selected: { label: '', value: '' },
    keyword: '',
    isFocus: false
  }

  changeOption = e => {
    const { onChange } = this.props
    const selectedValue = e.target.dataset.value
    const selectedLabel = e.target.innerText
    const selected = { value: selectedValue, label: selectedLabel }
    this.setState({ selected, isFocus: false }, () => {
      this.refs.input.value = selectedLabel
      if (typeof onChange === 'function') {
        onChange(selected)
      }
    })
  }

  value () {
    return this.state.selected
  }

  handleBlur = () => {
    this.setState({ isFocus: false })
  }

  handleToggleFocus = () => {
    const { isFocus } = this.state
    this.setState({ isFocus: !isFocus })
  }

  handleKeywordChange = e => {
    const newKeyword = e.target.value
    this.setState({ keyword: newKeyword })
  }

  filteredOptions = () => {
    const { keyword } = this.state
    const { options } = this.props
    return options.filter(option =>
      option.label.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  render () {
    const { isFocus } = this.state
    return (
      <div className="select-input">
        <input
          type="text"
          ref="input"
          onClick={this.handleToggleFocus}
          onChange={this.handleKeywordChange}
        />
        {isFocus && (
          <div className="options">
            {this.filteredOptions().map(option => (
              <div
                key={option.label}
                className="option"
                onClick={this.changeOption}
                data-value={option.value}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default SelectInput
