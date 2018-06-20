/* global location */

import { storageKeys, envs } from './webAuth'
import adminUrls from '../../admin-urls'
import browser from '../../browser'
import env from '../../env'
import localStorage from '../../localStorage'

module.exports = function () {
  Object.keys(storageKeys)
    .forEach(k => localStorage.remove(storageKeys[k]))
  const currentEnv = envs[env]
  const logoutSuccessUrl = escape(`${location.protocol}//${location.host}${adminUrls.loggedOut}`)
  console.log(logoutSuccessUrl)
  browser.redirect(`${currentEnv.domain}v2/logout?returnTo=${logoutSuccessUrl}`)
}
