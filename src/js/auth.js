import storage from './sessionStorage'
import { storageKeys } from './models/auth0/webAuth'

const roles = {
  superadmin: 'superadmin',
  cityadmin: 'cityadmin',
  tempaccomadmin: 'tempaccomadmin'
}

const getUserClaims = function () {
  const userClaims = storage.get(storageKeys.roles)
  if (!userClaims) return []
  return userClaims.toLowerCase().split(',')
}

const providerAdminFor = function () {
  const claims = getUserClaims()
  const adminForClaim = claims.find((c) => c.startsWith('adminfor:'))
  return adminForClaim !== undefined ? adminForClaim.split(':')[1] : ''
}

const cityAdminFor = function () {
  const claims = getUserClaims()
  const adminForClaim = claims.find((c) => c.startsWith('cityadminfor:'))
  return adminForClaim !== undefined ? adminForClaim.split(':')[1] : ''
}

const locationsAdminFor = function () {
  return getUserClaims()
    .filter((c) => c.startsWith('cityadminfor:'))
    .map((c) => c.split(':')[1])
}

const canSeeReviews = function () {
  const claims = getUserClaims()
  return claims.includes(roles.superadmin) || claims.includes(roles.tempaccomadmin)
}

const isSuperAdmin = function () {
  return getUserClaims().includes(roles.superadmin)
}

const isCityAdmin = function () {
  return getUserClaims().includes(roles.cityadmin)
}

module.exports = {
  getUserClaims,
  isSuperAdmin,
  providerAdminFor,
  canSeeReviews,
  isCityAdmin,
  cityAdminFor,
  locationsAdminFor
}
