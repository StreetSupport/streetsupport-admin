import auth0 from 'auth0-js'
import localStorage from '../../localStorage'

const storageKeys = {
  accessToken: 'access_token',
  idToken: 'id_token',
  expiresAt: 'expires_at',
  roles: 'roles'
}

module.exports = {
  isAuthenticated: function () {
    const expiresAt = JSON.parse(localStorage.get(storageKeys.expiresAt))
    const now = new Date().getTime()
    return now < expiresAt
  },
  getWebAuth: function () {
    return new auth0.WebAuth({
      domain: 'ssn-auth-dev.eu.auth0.com',
      clientID: 'Wiozbfk9PdmlaTm480kzoBFf2pHqXyK7',
      responseType: 'token id_token',
      audience: 'https://ssn-auth-dev.eu.auth0.com/userinfo',
      scope: 'openid',
      redirectUri: `${window.location.protocol}//${window.location.host}/login/authentication`
    })
  },
  storageKeys
}
