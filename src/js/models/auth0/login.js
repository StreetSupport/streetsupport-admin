import { getWebAuth } from './webAuth'

module.exports = function () {
  const self = this

  self.submit = function () {
    const webAuth = getWebAuth()
    webAuth.authorize()
  }
}
