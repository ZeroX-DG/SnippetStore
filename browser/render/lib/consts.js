const path = require('path')
const sander = require('sander')
const { remote } = require('electron')
const { app } = remote

const themePath = process.env.NODE_ENV === 'production'
  ? path.join(app.getAppPath(), './node_modules/codemirror/theme')
  : require('path').resolve('./node_modules/codemirror/theme')
const themes = sander.readdirSync(themePath)
  .map((themePath) => {
    return themePath.substring(0, themePath.lastIndexOf('.'))
  })


export default {
  EDITOR_THEMES: themes
}
