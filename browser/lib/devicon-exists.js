export default function isDevIconExists (className) {
  var cssSheets = document.styleSheets
  for (var i = 0; i < cssSheets.length; i++) {
    if (cssSheets[i].href) {
      const rules = (typeof cssSheets[i].cssRules !== 'undefined') ? cssSheets[i].cssRules : cssSheets[i].rules
      for (var j = 0; j < rules.length; j++) {
        if (rules[j].selectorText && rules[j].selectorText.includes(`.${className}`)) {
          return true
        }
      }
    }
  }
  return false
}
