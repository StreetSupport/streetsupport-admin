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

describe('Add Service Provider Service', () => {
  var Model = require('../../src/js/models/service-provider-services/AddServiceProviderService')
  var model
  var stubbedApi

  beforeEach(() => {
    function categoriesPromise (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'data': categories()
          })
        }
      }
    }

    function providerPromise (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'data': addresses()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')

    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }

    stubbedApi.withArgs(endpoints.getServiceCategories,
      headers,
      {}).returns(categoriesPromise())

    stubbedApi.withArgs(endpoints.getServiceProviders + '/coffee4craig',
      headers,
      {}).returns(providerPromise())

    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it('should request categories', () => {
    var endpoint = endpoints.getServiceCategories
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalled = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should request for provider', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig'
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalled = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should populate categories', () => {
    expect(model.categories().length).toEqual(2)
  })

  it('should populate addresses', () => {
    expect(model.addresses().length).toEqual(2)
  })

  it('address street should start empty', () => {
    expect(model.address().street1()).toEqual('')
  })

  it('address street should start empty', () => {
    expect(model.address().street1()).toEqual('')
  })

  describe('select category', () => {
    beforeEach(() => {
      model.category(model.categories()[0])
      model.setAvailableSubCategories()
    })

    it('should set subCategories', () => {
      expect(model.subCategories().length).toEqual(7)
    })

    it('should map subCategory key', () => {
      expect(model.subCategories()[0].key).toEqual('emergency')
    })

    it('should map subCategory name', () => {
      expect(model.subCategories()[0].name).toEqual('Emergency')
    })

    it('should set subCategory isSelected to false', () => {
      expect(model.subCategories()[0].isSelected()).toBeFalsy()
    })

    describe('select all subcategories', () => {
      beforeEach(() => {
        model.allSubCatsSelected(true)
      })

      it('- should select all subcats', () => {
        let totalSelected = model.subCategories().filter((sc) => sc.isSelected()).length
        expect(totalSelected).toEqual(model.subCategories().length)
      })

      describe('...then de-select all subcategories', () => {
        beforeEach(() => {
          model.allSubCatsSelected(false)
        })

        it('- should de-select all subcats', () => {
          let totalSelected = model.subCategories().filter((sc) => sc.isSelected()).length
          expect(totalSelected).toEqual(0)
        })
      })

      describe('...then change main category', () => {
        beforeEach(() => {
          model.category(model.categories()[1])
          model.setAvailableSubCategories()
        })

        it('- should de-select select all subcats', () => {
          expect(model.allSubCatsSelected()).toBeFalsy()
        })

        it('- should de-select all subcats', () => {
          let totalSelected = model.subCategories().filter((sc) => sc.isSelected()).length
          expect(totalSelected).toEqual(0)
        })
      })
    })
  })

  describe('select existing address', () => {
    beforeEach(() => {
      model.preselectedAddress(model.addresses()[0])
      model.prefillAddress()
    })

    it('should set address street 1', () => {
      expect(model.address().street1()).toEqual('5 Oak Street')
    })

    it('should set address street 2', () => {
      expect(model.address().street2()).toEqual('street 2')
    })

    it('should set address street 3', () => {
      expect(model.address().street3()).toEqual('street 3')
    })

    it('should set address street 4', () => {
      expect(model.address().street4()).toEqual('street 4')
    })

    it('should set address city', () => {
      expect(model.address().city()).toEqual('Manchester')
    })

    it('should set address postcode', () => {
      expect(model.address().postcode()).toEqual('M4 5JD')
    })

    it('should set address open 247', () => {
      expect(model.address().isOpen247()).toBeTruthy()
    })

    it('should set opening time start time', () => {
      expect(model.address().openingTimes()[0].startTime()).toEqual('10:00')
    })

    it('should set opening time end time', () => {
      expect(model.address().openingTimes()[0].endTime()).toEqual('16:30')
    })

    it('should set opening time day', () => {
      expect(model.address().openingTimes()[0].day()).toEqual('Monday')
    })
  })

  describe('save', () => {
    var stubbedPostApi
    var browserSpy

    beforeEach(() => {
      let savePromise = {
        then: function (success, error) {
          success({
            'statusCode': 201,
            'data': 'wang'
          })
        }
      }
      stubbedPostApi = sinon.stub(ajax, 'post').returns(savePromise)
      browserSpy = sinon.stub(browser, 'redirect')

      model.category(model.categories()[0])
      model.setAvailableSubCategories()
      model.subCategories()[1].isSelected(true)
      model.subCategories()[3].isSelected(true)

      model.info('new info')
      model.locationDescription('new location description')
      model.targetAudience('tag a, tag b')
      model.preselectedAddress(model.addresses()[0])
      model.prefillAddress()

      model.saveService()
    })

    afterEach(() => {
      ajax.post.restore()
      browser.redirect.restore()
    })

    it('should post service details with new to api with session token', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/services'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = {
        'Info': 'new info',
        'LocationDescription': 'new location description',
        'Tags': ['tag a', 'tag b'],
        'Category': 'accom',
        'SubCategories': ['hostel', 'rented'],
        'OpeningTimes': [{
          'StartTime': '10:00',
          'EndTime': '16:30',
          'Day': 'Monday'
        }, {
          'StartTime': '10:00',
          'EndTime': '16:30',
          'Day': 'Tuesday'
        }],
        'Street1': '5 Oak Street',
        'Street2': 'street 2',
        'Street3': 'street 3',
        'Street4': 'street 4',
        'City': 'Manchester',
        'Postcode': 'M4 5JD',
        'IsOpen247': true
      }

      var apiCalledWithExpectedArgs = stubbedPostApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect to services list', () => {
      var redirect = adminUrls.serviceProviders + '?key=coffee4craig'
      expect(browserSpy.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})

function categories () {
  return [{
    'key': 'accom',
    'sortOrder': 90,
    'name': 'Accommodation',
    'synopsis': 'Permanent and temporary accomodation.',
    'subCategories': [{
      'key': 'emergency',
      'name': 'Emergency',
      'synopsis': 'Emergency accomodation'
    }, {
      'key': 'hostel',
      'name': 'Hostel',
      'synopsis': 'Hostel accomodation'
    }, {
      'key': 'hosted',
      'name': 'Hosted',
      'synopsis': 'Hosted accomodation'
    }, {
      'key': 'rented',
      'name': 'Rented',
      'synopsis': 'Rented accomodation in the private sector'
    }, {
      'key': 'supported',
      'name': 'Supported',
      'synopsis': 'Supported lodgings'
    }, {
      'key': 'social',
      'name': 'Social Housing',
      'synopsis': 'Social Housing'
    }, {
      'key': 'shelter',
      'name': 'Night shelter',
      'synopsis': 'Night shelter'
    }],
    'documentCreationDate': '2015-12-16T16:12:49.8370000Z',
    'documentModifiedDate': '2015-12-16T16:12:49.8370000Z'
  }, {
    'key': 'communications',
    'sortOrder': 0,
    'name': 'Communications',
    'synopsis': 'Internet and telephone access, and postal services.',
    'subCategories': [{
      'key': 'telephone',
      'name': 'Telephone',
      'synopsis': 'Free telephone use'
    }, {
      'key': 'internet',
      'name': 'Internet access',
      'synopsis': 'Internet access'
    }],
    'documentCreationDate': '2015-12-16T16:12:49.8370000Z',
    'documentModifiedDate': '2015-12-16T16:12:49.8370000Z'
  }]
}

function addresses () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'addresses': [{
      'key': 1,
      'street': '5 Oak Street',
      'street1': 'street 2',
      'street2': 'street 3',
      'street3': 'street 4',
      'city': 'Manchester',
      'postcode': 'M4 5JD',
      'isOpen247': true,
      'openingTimes': [{
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Monday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Tuesday'
      }]
    }, {
      'key': 2,
      'street': 'Another address',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Manchester',
      'postcode': 'M1 2FY',
      'openingTimes': [{
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Monday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Tuesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Wednesday'
      }]
    }]
  }
}
