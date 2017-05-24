/* global describe, beforeEach, afterEach, it, expect */

const cookies = require('../../src/js/cookies')
const auth = require('../../src/js/auth')

const sinon = require('sinon')

describe('Auth Claims - getUserClaims', () => {
  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('auth-claims')
      .returns('Claim,Claim2')
  })

  afterEach(() => {
    cookies.get.restore()
  })

  it('- should return comma separated claims as array and lower case', () => {
    expect(auth.getUserClaims()[0]).toEqual('claim')
    expect(auth.getUserClaims()[1]).toEqual('claim2')
  })
})

describe('Auth Claims - isSuperAdmin', () => {
  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('auth-claims')
      .returns('SuperAdmin')
  })

  afterEach(() => {
    cookies.get.restore()
  })

  it('- should return superadmin is true', () => {
    expect(auth.isSuperAdmin).toBeTruthy()
  })
})

describe('Auth Claims - isSuperAdmin false', () => {
  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('auth-claims')
      .returns('SomeOtherClaim')
  })

  afterEach(() => {
    cookies.get.restore()
  })

  it('- should return superadmin is false', () => {
    expect(auth.isSuperAdmin()).toBeFalsy()
  })
})

describe('Auth Claims - Admin for service provider', () => {
  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('auth-claims')
      .returns('AdminFor:street-support,OrgAdmin')
  })

  afterEach(() => {
    cookies.get.restore()
  })

  it('- should return org id admin for', () => {
    expect(auth.providerAdminFor()).toEqual('street-support')
  })
})

describe('Auth Claims - can see reviews - if tempaccomadmin', () => {
  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('auth-claims')
      .returns('TempAccomAdmin')
  })

  afterEach(() => {
    cookies.get.restore()
  })

  it('- should return true', () => {
    expect(auth.canSeeReviews()).toBeTruthy()
  })
})

describe('Auth Claims - can see reviews - if not tempaccomadmin', () => {
  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('auth-claims')
      .returns('SomeOtherClaim')
  })

  afterEach(() => {
    cookies.get.restore()
  })

  it('- should return false', () => {
    expect(auth.canSeeReviews()).toBeFalsy()
  })
})
