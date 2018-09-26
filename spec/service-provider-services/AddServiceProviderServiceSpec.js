/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const adminUrls = require('../../src/js/admin-urls')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const endpoints = require('../../src/js/api-endpoints')
const getUrlParameter = require('../../src/js/get-url-parameter')
const sinon = require('sinon')

import { categories } from '../../src/data/generated/service-categories'

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

    stubbedApi.withArgs(endpoints.getServiceCategories,
      {}).returns(categoriesPromise())

    stubbedApi.withArgs(endpoints.getServiceProviders + '/coffee4craig',
      {}).returns(providerPromise())

    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParameter.parameter.restore()
  })

  it('should request for provider', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig'
    var payload = {}
    var apiCalled = stubbedApi.withArgs(endpoint, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should populate categories', () => {
    expect(model.categories().length).toEqual(categories.length)
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
      expect(model.subCategories().length).toEqual(categories[0].subCategories.length)
    })

    it('should map subCategory key', () => {
      expect(model.subCategories()[0].key).toEqual('animal-care')
    })

    it('should map subCategory name', () => {
      expect(model.subCategories()[0].name).toEqual('Animal welfare and vets')
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

    it('should set telephone', () => {
      expect(model.address().telephone()).toEqual('telephone')
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

    it('should post service details with new to api', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/services'
      var payload = {
        'Info': 'new info',
        'LocationDescription': 'new location description',
        'Tags': ['tag a', 'tag b'],
        'Category': categories[0].key,
        'SubCategories': ['asylum', 'bame'],
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
        'Telephone': 'telephone',
        'IsOpen247': true
      }

      var apiCalledWithExpectedArgs = stubbedPostApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect to services list', () => {
      var redirect = adminUrls.serviceProviders + '?key=coffee4craig'
      expect(browserSpy.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})

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
      'telephone': 'telephone',
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
      'telephone': 'telephone 2',
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
