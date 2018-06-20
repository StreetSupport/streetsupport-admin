/* global atob */

import { storageKeys } from './webAuth'
import browser from '../../browser'
import storage from '../../localStorage'
import jwt from 'jsonwebtoken'

module.exports = function () {
  function getParameterByName (name) {
    var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash)
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
  }

  const accessToken = getParameterByName('access_token')
  const idToken = getParameterByName('id_token')
  const state = getParameterByName('state')

  //todo: nonce check

  const storedState = storage.get(storageKeys.state)
  if (atob(state) !== storedState) { // csrf check
    browser.redirect('/login')
  }

  const roles = jwt.decode(idToken)['https://streetsupport.net/roles']

  var expiresAt = JSON.stringify(getParameterByName('expires_in') * 1000 + new Date().getTime())
  storage.set(storageKeys.accessToken, accessToken)
  storage.set(storageKeys.idToken, idToken)
  storage.set(storageKeys.expiresAt, expiresAt)
  storage.set(storageKeys.roles, roles)

  browser.redirect(`/?redirectUrl=${JSON.parse(storedState).redirectUrl}`)
}
