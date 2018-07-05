/* global btoa, location */

import { storageKeys, login } from '../../models/auth0/webAuth'
import adminUrls from '../../admin-urls'
import guid from 'node-uuid'
import querystring from '../../get-url-parameter'
import randomString from '../../randomString'
import storage from '../../localStorage'

module.exports = function () {
  const self = this

  // delete once released to live
  document.cookie = 'auth-claims=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

  self.submit = function () {
    const state = JSON.stringify({
      antiForgeryToken: guid.v4(),
      redirectUrl: querystring.parameter('redirectUrl')
    })
    const nonce = randomString(16)

    storage.set(storageKeys.state, state)
    storage.set(storageKeys.nonce, nonce)

    const encodedState = btoa(state)
    const loginSuccessUrl = escape(`${location.protocol}//${location.host}${adminUrls.authentication}`)

    login(loginSuccessUrl, nonce, encodedState)
  }
}
