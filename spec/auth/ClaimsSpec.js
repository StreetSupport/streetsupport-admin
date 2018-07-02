/* global describe, beforeEach, afterEach, it, expect */

const auth = require('../../src/js/auth')
const storage = require('../../src/js/localStorage')
import { storageKeys } from '../../src/js/models/auth0/webAuth'

const sinon = require('sinon')

describe('Auth Claims - getUserClaims', () => {
  beforeEach(() => {
    sinon.stub(storage, 'get')
      .withArgs(storageKeys.roles)
      .returns('Claim,Claim2')
  })

  afterEach(() => {
    storage.get.restore()
  })

  it('- should return comma separated claims as array and lower case', () => {
    expect(auth.getUserClaims()[0]).toEqual('claim')
    expect(auth.getUserClaims()[1]).toEqual('claim2')
  })
})

describe('Auth Claims - isSuperAdmin', () => {
  beforeEach(() => {
    sinon.stub(storage, 'get')
    .withArgs(storageKeys.roles)
      .returns('SuperAdmin')
  })

  afterEach(() => {
    storage.get.restore()
  })

  it('- should return superadmin is true', () => {
    expect(auth.isSuperAdmin).toBeTruthy()
  })
})

describe('Auth Claims - isSuperAdmin false', () => {
  beforeEach(() => {
    sinon.stub(storage, 'get')
    .withArgs(storageKeys.roles)
      .returns('SomeOtherClaim')
  })

  afterEach(() => {
    storage.get.restore()
  })

  it('- should return superadmin is false', () => {
    expect(auth.isSuperAdmin()).toBeFalsy()
  })
})

describe('Auth Claims - Admin for service provider', () => {
  beforeEach(() => {
    sinon.stub(storage, 'get')
    .withArgs(storageKeys.roles)
      .returns('AdminFor:street-support,OrgAdmin')
  })

  afterEach(() => {
    storage.get.restore()
  })

  it('- should return org id admin for', () => {
    expect(auth.providerAdminFor()).toEqual('street-support')
  })
})

describe('Auth Claims - can see reviews - if tempaccomadmin', () => {
  beforeEach(() => {
    sinon.stub(storage, 'get')
    .withArgs(storageKeys.roles)
      .returns('TempAccomAdmin')
  })

  afterEach(() => {
    storage.get.restore()
  })

  it('- should return true', () => {
    expect(auth.canSeeReviews()).toBeTruthy()
  })
})

describe('Auth Claims - can see reviews - if not tempaccomadmin', () => {
  beforeEach(() => {
    sinon.stub(storage, 'get')
    .withArgs(storageKeys.roles)
      .returns('SomeOtherClaim')
  })

  afterEach(() => {
    storage.get.restore()
  })

  it('- should return false', () => {
    expect(auth.canSeeReviews()).toBeFalsy()
  })
})
