import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import './tag-input'

export default class TagInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tags: ['electron', 'code']
    }
  }

  componentDidMount () {
    this.onTagInputChanged()
  }

  removeTag (removedTag) {
    const { tags } = this.state
    const newTags = tags.filter(tag => tag !== removedTag)
    this.setState({ tags: newTags })
  }

  getPreviousTag () {
    const { tags } = this.state
    return tags[tags.length - 1]
  }

  pushTag (tag) {
    const { tags } = this.state
    const uniqueTags = tags.filter(t => t !== tag)
    uniqueTags.push(tag)
    this.setState({ tags: uniqueTags }, () => {
      this.refs.input.value = ''
      this.onTagInputChanged()
    })
  }

  onTagInputChanged (e) {
    const input = this.refs.input
    const textLength = input.value.length
    if (e) {
      switch (e.which) {
        case 8: // BACKSPACE
          if (textLength === 0) {
            // nothing else to delete then delete the previous tag
            this.removeTag(this.getPreviousTag())
          }
          break
        case 9: // TAB KEY
        case 32: // SPACE KEY
          // prevent empty tag
          e.preventDefault()
          if (input.value.trim()) {
            this.pushTag(input.value)
          }
          break
      }
    }
    // reset input size
    const wordSpace = Math.ceil(textLength / 5)
    input.size = textLength + wordSpace + 1
    // make auto complete to follow
    this.refs.autoComplete.style.left = input.offsetLeft + 'px'
  }

  renderTags () {
    const { tags } = this.state
    const { color } = this.props
    return tags.map((tag, index) => (
      <span
        className="tag-input__tag"
        key={index}
        style={{ background: color.background, color: color.foreground }}
      >
        <span className="content">{tag}</span>
        <span className="remove-button" onClick={() => this.removeTag(tag)}>
          <FAIcon icon="times" />
        </span>
      </span>
    ))
  }

  onTagInputFocus () {
    this.refs.input.focus()
  }

  renderAutoCompleteTags () {
    const tags = ['electron', 'element', 'delete']
    return (
      <div className="tag-autocomplete" ref="autoComplete">
        <ul>
          {tags.map((tag, index) => (
            <li onClick={() => this.pushTag(tag)} key={index}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render () {
    return (
      <div className="tag-input" onClick={() => this.onTagInputFocus()}>
        {this.renderTags()}
        <input
          type="text"
          ref="input"
          onKeyDown={e => this.onTagInputChanged(e)}
        />
        {this.renderAutoCompleteTags()}
      </div>
    )
  }
}
