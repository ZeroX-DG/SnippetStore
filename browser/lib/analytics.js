import ua from 'universal-analytics'
import uuid from 'uuid/v4'
const Store = require('electron-store')
const store = new Store({ name: 'SnippetStoreUserInfo' })
const config = new Store({ name: 'SnippetStoreConf' })

// Retrieve the userid value, and if it's not there, assign it a new uuid.
const userId = store.get('userId') || uuid()
// (re)save the userid, so it persists for the next app session.
store.set('userId', userId)
const user = ua('UA-123395923-2', userId)
export function trackEvent (category, action, label, value) {
  if (config.get('config').allowAnalytics) {
    user
      .event({
        ec: category,
        ea: action,
        el: label,
        ev: value
      })
      .send()
  }
}

export function pageView (path) {
  if (config.get('config').allowAnalytics) {
    user.pageview(path).send()
  }
}
