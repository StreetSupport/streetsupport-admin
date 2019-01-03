'use strict'

const adminUrls = require('../admin-urls')
const browser = require('../browser')
const querystring = require('../get-url-parameter')
const BaseViewModel = require('./BaseViewModel')
import storage from '../sessionStorage'

import { isAuthenticated, storageKeys } from '../models/auth0/webAuth'

function Index () {
  const self = this
  self.init = function () {
    const adminForPrefix = 'adminfor:'
    const individualAccomAdminForPrefix = 'individualaccomadminfor:'

    const roles = storage.get(storageKeys.roles)
    const authClaims = roles
      ? roles.toLowerCase().split(',')
      : []
    const redirectUrl = querystring.parameter('redirectUrl')
    const orgAdminForClaim = roles && authClaims.find((a) => a.indexOf(adminForPrefix) === 0)
      ? authClaims.find((a) => a.indexOf(adminForPrefix) === 0)
      : ''

    const getIndividualAccomNewLocation = function () {
      const accomAdminForId = authClaims.find((a) => a.indexOf(individualAccomAdminForPrefix) === 0)
      return accomAdminForId
        ? `${adminUrls.temporaryAccommodation}/edit/?id=${accomAdminForId.substring(individualAccomAdminForPrefix.length)}`
        : adminUrls.forbidden
    }

    const rules = [
      { getPredicate: () => !isAuthenticated(), newLocation: adminUrls.login },
      { getPredicate: () => redirectUrl !== undefined && redirectUrl.indexOf(browser.origin()) === 0, newLocation: redirectUrl },
      { getPredicate: () => orgAdminForClaim.length > 0, newLocation: `${adminUrls.serviceProviders}?key=${orgAdminForClaim.substring(adminForPrefix.length)}` },
      { getPredicate: () => authClaims.includes('superadmin'), newLocation: adminUrls.dashboard },
      { getPredicate: () => authClaims.includes('cityadmin'), newLocation: adminUrls.dashboard },
      { getPredicate: () => authClaims.includes('charteradmin'), newLocation: adminUrls.charter },
      { getPredicate: () => authClaims.includes('tempaccomadmin'), newLocation: adminUrls.temporaryAccommodation },
      { getPredicate: () => authClaims.includes('individualaccomadmin'), newLocation: getIndividualAccomNewLocation() },
      { getPredicate: () => { return true }, newLocation: adminUrls.forbidden }
    ]

    browser.redirect(rules.find((r) => r.getPredicate()).newLocation)
  }

  self.init()
}

Index.prototype = new BaseViewModel()

module.exports = Index
