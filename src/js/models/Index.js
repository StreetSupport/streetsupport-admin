'use strict'

const adminUrls = require('../admin-urls')
const browser = require('../browser')
const querystring = require('../get-url-parameter')
const BaseViewModel = require('./BaseViewModel')
import storage from '../localStorage'

import { isAuthenticated, storageKeys } from '../models/auth0/webAuth'

function Index () {
  const self = this
  self.init = function () {
    const adminForPrefix = 'adminfor:'

    const success = (authClaims) => {
      const redirectUrl = querystring.parameter('redirectUrl')
      const orgAdminForClaim = authClaims.find((a) => a.indexOf(adminForPrefix) === 0)

      if (redirectUrl !== undefined && redirectUrl.indexOf(browser.origin()) === 0) {
        browser.redirect(redirectUrl)
      } else if (orgAdminForClaim) {
        const providerKey = orgAdminForClaim.substring(adminForPrefix.length)
        const destination = adminUrls.serviceProviders + '?key=' + providerKey
        browser.redirect(destination)
      } else if (authClaims.includes('superadmin')) {
        browser.redirect(adminUrls.dashboard)
      } else if (authClaims.includes('cityadmin')) {
        browser.redirect(adminUrls.dashboard)
      } else if (authClaims.includes('charteradmin')) {
        browser.redirect(adminUrls.charter)
      } else if (authClaims.includes('tempaccomadmin')) {
        browser.redirect(adminUrls.temporaryAccommodation)
      } else if (authClaims.includes('individualaccomadmin')) {
        const individualAccomAdminForPrefix = 'individualaccomadminfor:'
        const accomAdminForId = authClaims.find((a) => a.indexOf(individualAccomAdminForPrefix) === 0).substring(individualAccomAdminForPrefix.length)
        browser.redirect(`${adminUrls.temporaryAccommodation}/edit/?id=${accomAdminForId}`)
      }
    }

    if (!isAuthenticated()) {
      browser.redirect(adminUrls.login)
    } else {
      success(storage.get(storageKeys.roles).toLowerCase().split(','))
    }
  }

  self.init()
}

Index.prototype = new BaseViewModel()

module.exports = Index
