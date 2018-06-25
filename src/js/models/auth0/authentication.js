/* global atob */

import { storageKeys } from './webAuth'
import browser from '../../browser'
import storage from '../../localStorage'
import { hashParameter } from '../../get-url-parameter'
import jwt from 'jsonwebtoken'

module.exports = function () {
  const { accessToken, idToken, decodedIdToken, state } = retrieveResponseTokens()
  const { storedState, storedNonce } = retrieveRequestTokens()

  if (responseIsInvalid(state, storedState, decodedIdToken, storedNonce)) {
    browser.redirect('/login')
  }

  storeAuthValues(decodedIdToken, accessToken, idToken)
  browser.redirect(`/?redirectUrl=${JSON.parse(storedState).redirectUrl}`)
}

function retrieveResponseTokens () {
  const idToken = hashParameter('id_token')
  return {
    accessToken: hashParameter('access_token'),
    idToken,
    state: hashParameter('state'),
    decodedIdToken: jwt.decode(idToken)
  }
}

function retrieveRequestTokens () {
  return {
    storedState: storage.get(storageKeys.state),
    storedNonce: storage.get(storageKeys.nonce)
  }
}

function responseIsInvalid (state, storedState, decodedIdToken, storedNonce) {
  function isReplayAttack () {
    return decodedIdToken.nonce !== storedNonce
  }

  function isCsrfAttack () {
    return atob(state) !== storedState
  }

  return isCsrfAttack() || isReplayAttack()
}

function storeAuthValues (decodedIdToken, accessToken, idToken) {
  const expiresAt = JSON.stringify(hashParameter('expires_in') * 1000 + new Date().getTime())
  const roles = decodedIdToken['https://streetsupport.net/roles']
  storage.set(storageKeys.accessToken, accessToken)
  storage.set(storageKeys.expiresAt, expiresAt)
  storage.set(storageKeys.idToken, idToken)
  storage.set(storageKeys.roles, roles)
}

