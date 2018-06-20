import localStorage from '../../localStorage'

const storageKeys = {
  accessToken: 'access_token',
  idToken: 'id_token',
  state: 'auth-state',
  nonce: 'auth-nonce',
  expiresAt: 'expires_at',
  roles: 'roles'
}

module.exports = {
  isAuthenticated: function () {
    const expiresAt = JSON.parse(localStorage.get(storageKeys.expiresAt))
    const now = new Date().getTime()
    return now < expiresAt
  },
  storageKeys
}
