import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import i18n from 'render/lib/i18n'
import formatDate from 'lib/date-format'
import './snippet-item'

export default class SnippetItem extends React.Component {
  render () {
    const { snippet } = this.props
    return (
      <div className="snippet-item list-and-detail">
        <p className="name">
          <span className="icon">
            {snippet.files ? (
              <FAIcon icon="copy" />
            ) : (
              <FAIcon icon="file-code" />
            )}
          </span>
          {snippet.name}
        </p>
        <p className="m-t-10">
          {i18n.__('Create at')} : {formatDate(snippet.createAt)}
        </p>
        <p className="m-t-5">
          {i18n.__('Last update')} : {formatDate(snippet.updateAt)}
        </p>
      </div>
    )
  }
}
