/* global atob */

import { storageKeys } from './webAuth'
import browser from '../../browser'
import storage from '../../localStorage'
import { hashParameter } from '../../get-url-parameter'
import jwt from 'jsonwebtoken'

module.exports = function () {
  const accessToken = hashParameter('access_token')
  const idToken = hashParameter('id_token')
  const state = hashParameter('state')

  const storedState = storage.get(storageKeys.state)
  const decodedIdToken = jwt.decode(idToken)
  const storedNonce = storage.get(storageKeys.nonce)

  if (atob(state) !== storedState || decodedIdToken.nonce !== storedNonce) { // csrf/replay check
    browser.redirect('/login')
  }

  const roles = decodedIdToken['https://streetsupport.net/roles']

  const expiresAt = JSON.stringify(hashParameter('expires_in') * 1000 + new Date().getTime())
  storage.set(storageKeys.accessToken, accessToken)
  storage.set(storageKeys.idToken, idToken)
  storage.set(storageKeys.expiresAt, expiresAt)
  storage.set(storageKeys.roles, roles)

  browser.redirect(`/?redirectUrl=${JSON.parse(storedState).redirectUrl}`)
}
