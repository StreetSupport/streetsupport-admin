/* global location */

import { logout, storageKeys } from './webAuth'
import adminUrls from '../../admin-urls'
import storage from '../../sessionStorage'

module.exports = function () {
  Object.keys(storageKeys)
    .forEach(k => storage.remove(storageKeys[k]))

  const logoutSuccessUrl = escape(`${location.protocol}//${location.host}${adminUrls.loggedOut}`)
  logout(logoutSuccessUrl)
}
