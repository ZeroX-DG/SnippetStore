import React from 'react'
import i18n from 'render/lib/i18n'
import './sort-snippet-tool'

export default class SortSnippetTool extends React.Component {
  handleSort (type) {
    this.props.store.sort = type
  }

  render () {
    return (
      <div className="sort-snippet-tool">
        <select
          className="sort-snippet-select"
          onChange={e => this.handleSort(e.target.value)}
        >
          <option value="createTimeNewer">
            {i18n.__('Sort by create time (newest)')}
          </option>
          <option value="createTimeOlder">
            {i18n.__('Sort by create time (oldest)')}
          </option>
          <option value="updateTimeNewer">
            {i18n.__('Sort by update time (newest)')}
          </option>
          <option value="updateTimeOlder">
            {i18n.__('Sort by update time (oldest)')}
          </option>
          <option value="copyCountAsc">
            {i18n.__('Sort by copy count (ascending)')}
          </option>
          <option value="copyCountDesc">
            {i18n.__('Sort by copy count (descending)')}
          </option>
        </select>
      </div>
    )
  }
}
