import browser from '../../browser'
import env from '../../env'
import storage from '../../localStorage'

const storageKeys = {
  accessToken: 'access_token',
  idToken: 'id_token',
  state: 'auth-state',
  nonce: 'auth-nonce',
  expiresAt: 'expires_at',
  roles: 'roles'
}

const local = {
  domain: 'https://ssn-auth-dev.eu.auth0.com/',
  apiIdentifier: 'ssn-api-local',
  clientId: 'Wiozbfk9PdmlaTm480kzoBFf2pHqXyK7'
}

const envs = [
  local
]

const currentEnv = envs[env]

const isAuthenticated = function () {
  const expiresAt = JSON.parse(storage.get(storageKeys.expiresAt))
  const now = new Date().getTime()
  return now < expiresAt
}

const login = function (loginSuccessUrl, nonce, encodedState) {
  browser.redirect(`${currentEnv.domain}authorize?` +
    `audience=${currentEnv.apiIdentifier}&` +
    'scope=profile&' +
    'response_type=id_token token&' +
    `client_id=${currentEnv.clientId}&` +
    `redirect_uri=${loginSuccessUrl}&` + // extract
    `nonce=${nonce}&` +
    `state=${encodedState}`)
}

const logout = function (logoutSuccessUrl) {
  browser.redirect(`${currentEnv.domain}v2/logout?returnTo=${logoutSuccessUrl}`)
}

module.exports = {
  envs,
  isAuthenticated,
  login,
  logout,
  storageKeys
}
