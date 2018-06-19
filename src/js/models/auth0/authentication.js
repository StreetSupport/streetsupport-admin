import { getWebAuth, storageKeys } from './webAuth'
import browser from '../../browser'
import localStorage from '../../localStorage'

module.exports = function () {
  function setSession (authResult) {
    var expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    localStorage.set(storageKeys.accessToken, authResult.accessToken)
    localStorage.set(storageKeys.idToken, authResult.idToken)
    localStorage.set(storageKeys.expiresAt, expiresAt)
    localStorage.set(storageKeys.roles, [...authResult.idTokenPayload['https://streetsupport.net/roles']])
  }

  function handleAuthentication (webAuth) {
    webAuth.parseHash(function (err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = ''
        setSession(authResult)
        browser.redirect('/')
      } else if (err) {
        console.log(err)
        window.alert('Error: ' + err.error + '. Check the console for further details.')
      }
    })
  }

  handleAuthentication(getWebAuth())
}
