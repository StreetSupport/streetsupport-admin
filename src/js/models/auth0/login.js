/* global btoa, crypto, location */

import guid from 'node-uuid'

import browser from '../../browser'
import env from '../../env'
import storage from '../../localStorage'
import { storageKeys, envs } from '../../models/auth0/webAuth'
import querystring from '../../get-url-parameter'
import adminUrls from '../../admin-urls'

function randomString (length) {
  const bytes = new Uint8Array(length)
  const random = crypto.getRandomValues(bytes)
  const result = []
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
  random.forEach(function (c) {
    result.push(charset[c % charset.length])
  })
  return result.join('')
}

module.exports = function () {
  const self = this

  self.submit = function () {
    const state = JSON.stringify({
      antiForgeryToken: guid.v4(),
      redirectUrl: querystring.parameter('redirectUrl')
    })
    const encodedState = btoa(state)
    const nonce = randomString(16)

    const currentEnv = envs[env]

    storage.set(storageKeys.state, state)
    storage.set(storageKeys.nonce, nonce)

    const loginSuccessUrl = escape(`${location.protocol}//${location.host}${adminUrls.authentication}`)

    browser.redirect(`${currentEnv.domain}authorize?` +
      `audience=${currentEnv.apiIdentifier}&` +
      'scope=profile&' +
      'response_type=id_token token&' +
      `client_id=${currentEnv.clientId}&` +
      `redirect_uri=${loginSuccessUrl}&` + // extract
      `nonce=${nonce}&` +
      `state=${encodedState}`)
  }
}
