import localStorage from '../../localStorage'

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

module.exports = {
  isAuthenticated: function () {
    const expiresAt = JSON.parse(localStorage.get(storageKeys.expiresAt))
    const now = new Date().getTime()
    return now < expiresAt
  },
  storageKeys,
  envs
}
