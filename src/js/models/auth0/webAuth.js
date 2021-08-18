import browser from '../../browser'
import env from '../../env'
import storage from '../../sessionStorage'

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
const dev = {
  domain: 'https://ssn-auth-dev.eu.auth0.com/',
  apiIdentifier: 'ssn-api-dev',
  clientId: 'Wiozbfk9PdmlaTm480kzoBFf2pHqXyK7'
}
const uat = {
  domain: 'https://ssn-auth-uat.eu.auth0.com/',
  apiIdentifier: 'ssn-api-uat',
  clientId: 'zThfa9fQo1b84lHGWQGO9TuefIy1dT29'
}
const prod = {
  domain: 'https://streetsupport.eu.auth0.com/',
  apiIdentifier: 'ssn-api-prod',
  clientId: 'AXC3580I3Q2MAu3iYFlNIAe42BJ5V4z2'
}

const envs = [
  local,
  dev,
  uat,
  prod
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
