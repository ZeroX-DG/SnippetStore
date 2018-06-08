import path from 'path'
import { remote } from 'electron'
const { app } = remote
import { getLanguageCodes } from './languages'

// load package for localization
const i18n = new (require('i18n-2'))({
  // load all language codes
  locales: getLanguageCodes(),
  extension: '.json',
  directory: process.env.NODE_ENV === 'production'
    ? path.join(app.getAppPath(), './languages')
    : path.resolve('./languages'),
  devMode: false
})

export default i18n
