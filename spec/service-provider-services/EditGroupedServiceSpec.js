/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var cookies = require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')
var browser = require('../../src/js/browser')
var adminUrls = require('../../src/js/admin-urls')

describe('Edit Service', () => {
  let Model = require('../../src/js/models/service-provider-services/EditGroupedService')
  let model = null
  let stubbedApi = null
  let stubbedUrlParams = null
  let stubbedBrowser = null

  let payload = {}

  let serviceEndpoint = endpoints.getServiceProviders + '/coffee4craig/services/57bdb2c58705422ecc657228'
  let categoryEndpoint = endpoints.getServiceCategories

  beforeEach(() => {
    let serviceDataResolution = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': serviceData()
        })
      }
    }
    let categoryDataResolution = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': categoryData()
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')
    stubbedApi.withArgs(serviceEndpoint, payload).returns(serviceDataResolution)
    stubbedApi.withArgs(categoryEndpoint, payload).returns(categoryDataResolution)
    stubbedBrowser = sinon.stub(browser, 'redirect')
    sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter')
    stubbedUrlParams.withArgs('providerId').returns('coffee4craig')
    stubbedUrlParams.withArgs('serviceId').returns('57bdb2c58705422ecc657228')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.redirect.restore()
  })

  it('should request for service', () => {
    var apiCalled = stubbedApi.withArgs(serviceEndpoint, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should request for categories', () => {
    var apiCalled = stubbedApi.withArgs(categoryEndpoint, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should set serviceProviderId on Service', () => {
    expect(model.service().serviceProviderId).toEqual('vince-test-provider')
  })

  it('should set name on Service', () => {
    expect(model.service().name).toEqual('Personal Items')
  })

  it('should set info on Service', () => {
    expect(model.service().info()).toEqual('St George\'s Crypt offers')
  })

  it('should set location description on Service', () => {
    expect(model.service().locationDescription()).toEqual('location description')
  })

  it('should set opening times start time on Service', () => {
    expect(model.service().openingTimes()[0].startTime()).toEqual('10:00')
  })

  it('should set opening times end time on Service', () => {
    expect(model.service().openingTimes()[0].endTime()).toEqual('18:00')
  })

  it('- should set categories', () => {
    expect(model.service().subCategories().length).toEqual(5)
  })

  it('- should set telephone', () => {
    expect(model.service().address.telephone()).toEqual('telephone')
  })

  it('- should set category id', () => {
    expect(model.service().subCategories()[0].id()).toEqual('laundry')
  })

  it('- should set category name', () => {
    expect(model.service().subCategories()[0].name()).toEqual('Laundry')
  })

  it('- should set category isSelected', () => {
    expect(model.service().subCategories()[0].isSelected()).toBeFalsy()
    expect(model.service().subCategories()[1].isSelected()).toBeFalsy()
    expect(model.service().subCategories()[2].isSelected()).toBeFalsy()
    expect(model.service().subCategories()[3].isSelected()).toBeTruthy()
    expect(model.service().subCategories()[4].isSelected()).toBeTruthy()
  })

  describe('select all subcategories', () => {
    beforeEach(() => {
      model.allSubCatsSelected(true)
    })

    it('- should select all subcats', () => {
      let totalSelected = model.service().subCategories().filter((sc) => sc.isSelected()).length
      expect(totalSelected).toEqual(model.service().subCategories().length)
    })

    describe('...then de-select all subcategories', () => {
      beforeEach(() => {
        model.allSubCatsSelected(false)
      })

      it('- should de-select all subcats', () => {
        let totalSelected = model.service().subCategories().filter((sc) => sc.isSelected()).length
        expect(totalSelected).toEqual(0)
      })
    })
  })

  describe('Save', () => {
    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'statusCode': 200,
            'data': serviceData()
          })
        }
      }

      stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved)

      model.service().save()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should redirect to service provider', () => {
      expect(stubbedBrowser.withArgs(adminUrls.serviceProviders + '?key=coffee4craig').calledOnce).toBeTruthy()
    })
  })
})

function categoryData () {
  return [
    {
      'key': 'items',
      'sortOrder': 0,
      'name': 'Personal Items',
      'synopsis': 'Haircuts, laundry, showers, religious services ...',
      'subCategories': [
        {
          'key': 'laundry',
          'name': 'Laundry',
          'synopsis': 'Clothes washing service'
        },
        {
          'key': 'shower',
          'name': 'Showers',
          'synopsis': 'Hot showers'
        },
        {
          'key': 'haircut',
          'name': 'Haircuts',
          'synopsis': 'Haircuts'
        },
        {
          'key': 'blankets',
          'name': 'Blankets',
          'synopsis': 'Blankets'
        },
        {
          'key': 'clothes',
          'name': 'Clothes',
          'synopsis': 'Clothes'
        }
      ],
      'documentCreationDate': '2015-12-17T12:18:00.1650000Z',
      'documentModifiedDate': '2015-12-17T12:18:00.1650000Z'
    }
  ]
}

function serviceData () {
  return {
    'id': '57bdb2c58705422ecc657228',
    'categoryId': 'items',
    'categoryName': 'Personal Items',
    'categorySynopsis': 'Clothes, blankets, shoes, sleeping bags, and disposable goods including toiletries and sanitary products',
    'info': 'St George&#39;s Crypt offers',
    'tags': [
      'lesbians'
    ],
    'telephone': 'telephone',
    'location': {
      'description': 'location description',
      'streetLine1': 'street 1',
      'streetLine2': 'street 2',
      'streetLine3': '',
      'streetLine4': '',
      'city': 'Manchester',
      'postcode': 'm3 3IF',
      'latitude': 53.4755361548836,
      'longitude': -2.25848699844466
    },
    'openingTimes': [
      {
        'startTime': '10:00',
        'endTime': '18:00',
        'day': 'Tuesday'
      }
    ],
    'serviceProviderId': 'vince-test-provider',
    'serviceProviderName': 'Vince Test Provider',
    'isPublished': false,
    'subCategories': [
      {
        'id': 'clothes',
        'name': 'Clothes'
      },
      {
        'id': 'blankets',
        'name': 'Blankets'
      }
    ]
  }
}
