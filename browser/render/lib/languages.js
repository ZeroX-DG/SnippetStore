const languages = [
  { name: 'English', code: 'en' },
  { name: 'Tiếng Việt', code: 'vi' },
  // thanks @zbahadir for Turkish translation
  { name: 'Turkish', code: 'tr' },

  { name: '简体中文', code: 'zh-cn' },
  // thanks nickyg.pf for Italian translation
  { name: 'Italian', code: 'it' },
  // vncnt-dev: de translation
  { name: 'Deutsch', code: 'de' },
  // thanks Devincompris for fr translation
  { name: 'Française', code: 'fr' },
  // thanks Smart-Guide for ru translation
  { name: 'русский', code: 'ru' },
]

module.exports = {
  getLanguageCodes () {
    return languages.reduce(function (codes, lang) {
      codes.push(lang.code)
      return codes
    }, [])
  },
  getLanguages () {
    return languages
  }
}
