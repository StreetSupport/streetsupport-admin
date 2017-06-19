'use strict'

const adminUrls = require('../admin-urls')
const ajax = require('../ajax')
const browser = require('../browser')
const cookies = require('../cookies')
const querystring = require('../get-url-parameter')
const BaseViewModel = require('./BaseViewModel')

function Index () {
  const self = this
  self.init = function () {
    const sessionToken = cookies.get('session-token')

    const adminForPrefix = 'AdminFor:'

    const success = (result) => {
      const redirectUrl = querystring.parameter('redirectUrl')
      const authClaims = result.data.authClaims
      const orgAdminForClaim = authClaims.find((a) => a.indexOf(adminForPrefix) === 0)

      if (redirectUrl !== undefined && redirectUrl.indexOf(browser.origin()) === 0) {
        browser.redirect(redirectUrl)
      } else if (orgAdminForClaim) {
        const providerKey = orgAdminForClaim.substring(adminForPrefix.length)
        const destination = adminUrls.serviceProviders + '?key=' + providerKey
        browser.redirect(destination)
      } else if (authClaims.includes('SuperAdmin')) {
        browser.redirect(adminUrls.dashboard)
      } else if (authClaims.includes('CityAdmin')) {
        browser.redirect(adminUrls.dashboard)
      } else if (authClaims.includes('CharterAdmin')) {
        browser.redirect(adminUrls.charter)
      } else if (authClaims.includes('TempAccomAdmin')) {
        browser.redirect(adminUrls.temporaryAccommodation)
      } else if (authClaims.includes('IndividualAccomAdmin')) {
        const individualAccomAdminForPrefix = 'IndividualAccomAdminFor:'
        const accomAdminForId = authClaims.find((a) => a.indexOf(individualAccomAdminForPrefix) === 0).substring(individualAccomAdminForPrefix.length)
        browser.redirect(`${adminUrls.temporaryAccommodation}/edit/?id=${accomAdminForId}`)
      }
    }

    const error = () => {
      browser.redirect(adminUrls.login)
    }

    if (sessionToken === null || sessionToken === undefined) {
      browser.redirect(adminUrls.login)
    } else {
      ajax.get(self.endpointBuilder.sessions().build(), self.headers(sessionToken), {})
        .then(success, error)
    }
  }

  self.init()
}

Index.prototype = new BaseViewModel()

module.exports = Index
