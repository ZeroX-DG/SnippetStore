import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import { inject } from 'mobx-react'
import './tag-input'

@inject('store')
export default class TagInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tags: props.defaultTags || [],
      suggestedTags: [],
      selectedSuggestedTag: ''
    }
  }

  componentDidMount () {
    this.onTagInputChanged()
  }

  removeTag (removedTag) {
    const { tags } = this.state
    const newTags = tags.filter(tag => tag !== removedTag)
    this.setState({ tags: newTags }, () => {
      this.onTagInputChanged()
    })
  }

  getPreviousTag (tag) {
    const { tags } = this.state
    return tags[tags.length - 1]
  }

  getNextSuggestedTag (tag, direction) {
    const { suggestedTags } = this.state
    let newIndex = suggestedTags.indexOf(tag) + (direction === 'up' ? -1 : 1)
    if (newIndex < 0) {
      newIndex = suggestedTags.length - 1
    } else if (newIndex > suggestedTags.length - 1) {
      newIndex = 0
    }
    return suggestedTags[newIndex]
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
    const { selectedSuggestedTag, tags } = this.state
    const allTags = this.props.store.tagNames
    let suggestedTags = input.value
      ? allTags.filter(tag => tag.indexOf(input.value) !== -1)
      : []
    suggestedTags = suggestedTags.filter(tag => tags.indexOf(tag) === -1)
    this.setState({ suggestedTags })
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
        case 40: // DOWN ARROW
          e.preventDefault()
          if (!selectedSuggestedTag) {
            this.setState({ selectedSuggestedTag: suggestedTags[0] })
          } else {
            const nextSuggestedTag = this.getNextSuggestedTag(
              selectedSuggestedTag,
              'down'
            )
            this.setState({
              selectedSuggestedTag: nextSuggestedTag
            })
          }
          break
        case 38: // UP ARROW
          e.preventDefault()
          if (!selectedSuggestedTag) {
            this.setState({ selectedSuggestedTag: suggestedTags[0] })
          } else {
            const nextSuggestedTag = this.getNextSuggestedTag(
              selectedSuggestedTag,
              'up'
            )
            this.setState({
              selectedSuggestedTag: nextSuggestedTag
            })
          }
          break
        case 13: // ENTER KEY
          e.preventDefault()
          if (selectedSuggestedTag) {
            this.pushTag(selectedSuggestedTag)
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
    const { selectedSuggestedTag, suggestedTags } = this.state
    return (
      <div className="tag-autocomplete" ref="autoComplete">
        <ul>
          {suggestedTags.map((tag, index) => (
            <li
              onClick={() => this.pushTag(tag)}
              className={selectedSuggestedTag === tag ? 'selected' : ''}
              key={index}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  getTags () {
    return this.state.tags
  }

  render () {
    const { maxHeight } = this.props
    return (
      <div
        className="tag-input"
        style={{
          maxHeight: maxHeight || 'initial'
        }}
        onClick={() => this.onTagInputFocus()}
      >
        {this.renderTags()}
        <input
          type="text"
          ref="input"
          onKeyDown={e => this.onTagInputChanged(e)}
          onChange={e => this.onTagInputChanged(e)}
        />
        {this.renderAutoCompleteTags()}
      </div>
    )
  }
}
