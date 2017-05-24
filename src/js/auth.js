const cookies = require('./cookies')

const roles = {
  superadmin: 'superadmin',
  tempaccomadmin: 'tempaccomadmin'
}

const getUserClaims = function () {
  const userClaims = cookies.get('auth-claims')
  if (userClaims === undefined) return []
  return userClaims.toLowerCase().split(',')
}

const providerAdminFor = function () {
  const claims = getUserClaims()
  const adminForClaim = claims.find((c) => c.startsWith('adminfor:'))
  return adminForClaim !== undefined ? adminForClaim.split(':')[1] : ''
}

const canSeeReviews = function () {
  const claims = getUserClaims()
  return claims.includes(roles.superadmin) || claims.includes(roles.tempaccomadmin)
}

const isSuperAdmin = function () {
  return getUserClaims().includes(roles.superadmin)
}

module.exports = {
  getUserClaims,
  isSuperAdmin,
  providerAdminFor,
  canSeeReviews
}
