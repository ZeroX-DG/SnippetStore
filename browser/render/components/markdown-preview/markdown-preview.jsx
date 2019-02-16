import React from 'react'
import marked from 'marked'
import _ from 'lodash'
import CM from 'lib/config-manager'
import './markdown-preview.sass'
import { shell } from 'electron'

const baseMarkdownCSS = require('!!css-loader!./github-markdown.css') // eslint-disable-line

class MarkdownPreview extends React.Component {
  componentDidMount () {
    this.init()
  }

  componentDidUpdate () {
    this.init()
  }

  init () {
    const previewDoc = this.refs.preview.contentWindow.document
    previewDoc.body.innerHTML = ''
    previewDoc.write(this.buildHTML())
    this.initActions(previewDoc)
  }

  initActions (previewDoc) {
    const links = previewDoc.getElementsByTagName('a')
    _.forEach(links, link => {
      link.onclick = e => {
        e.preventDefault()
        shell.openExternal(link.href)
      }
    })
  }

  getMarkdownCSSTheme () {
    const config = CM.get()
    let markdownCSSTheme = ''
    if (config.ui.theme === 'dark') {
      markdownCSSTheme = require('!!css-loader!./dark-markdown.css') // eslint-disable-line
    } else if (config.ui.theme === 'light') {
      markdownCSSTheme = require('!!css-loader!./light-markdown.css') // eslint-disable-line
    }
    return markdownCSSTheme
  }

  buildHTML () {
    const { markdown } = this.props
    const body = marked(markdown)
    return `<html>
        <head>
          <meta charset="UTF-8">
          <meta name = "viewport" content = "width = device-width, initial-scale = 1, maximum-scale = 1">
          <style id="style">${baseMarkdownCSS}</style>
          <style>${this.getMarkdownCSSTheme()}</style>
        </head>
        <body class='markdown-body'>${body}</body>
    </html>`
  }

  render () {
    const { style } = this.props
    return (
      <iframe ref="preview" style={style || {}} className="markdownPreview" />
    )
  }
}

export default MarkdownPreview
