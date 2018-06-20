/* global btoa, crypto */

import guid from 'node-uuid'

import browser from '../../browser'
import storage from '../../localStorage'
import { storageKeys } from '../../models/auth0/webAuth'
import querystring from '../../get-url-parameter'

function randomString (length) {
  const bytes = new Uint8Array(length)
  const random = crypto.getRandomValues(bytes)
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
  const result = random.map((c) => charset[c % charset.length])
  return result.join('')
}

module.exports = function () {
  const self = this

  self.submit = function () {
    const state = JSON.stringify({
      antiForgeryToken: guid.v4(),
      redirectUrl: querystring.parameter('redirectUrl')
    })
    storage.set(storageKeys.state, state)
    const encodedState = btoa(state)
    const nonce = randomString(16) // todo: https://auth0.com/docs/api-auth/tutorials/nonce
    storage.set(storageKeys.nonce, nonce)

    console.log({ state, encodedState, nonce })

    browser.redirect('https://ssn-auth-dev.eu.auth0.com/authorize?' +
      'audience=ssn-api-local&' +
      'scope=profile&' +
      'response_type=id_token token&' +
      'client_id=Wiozbfk9PdmlaTm480kzoBFf2pHqXyK7&' +
      'redirect_uri=http://localhost:3000/login/authentication&' +
      `nonce=${nonce}&` +
      `state=${encodedState}`)
  }
}
