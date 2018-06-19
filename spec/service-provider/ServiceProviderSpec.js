/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const endpoints = require('../../src/js/api-endpoints')
const browser = require('../../src/js/browser')
const getUrlParameter = require('../../src/js/get-url-parameter')
const spTags = require('../../src/js/serviceProviderTags')

import { cities } from '../../src/data/generated/supported-cities'

describe('Show Service Provider', () => {
  var Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  var model
  var stubbedApi

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(spTags, 'all').returns([
      { id: 'tag-a', name: 'Tag A' },
      { id: 'tag-b', name: 'Tag B' },
      { id: 'tag-c', name: 'Tag C' },
      { id: 'tag-d', name: 'Tag D' },
      { id: 'tag-e', name: 'Tag E' }
    ])

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
    spTags.all.restore()
  })

  it('should retrieve service provider from api', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig'
    var payload = {}
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  it('should set service provider', () => {
    expect(model.serviceProvider().key()).toEqual('coffee4craig')
  })

  it('should set verified flag', () => {
    expect(model.serviceProvider().isVerified()).toEqual(coffee4Craig().isVerified)
  })

  it('should set associated City', () => {
    expect(model.serviceProvider().city()).toEqual('manchester')
  })

  it('should set cities collection', () => {
    expect(model.serviceProvider().availableCities().length).toEqual(cities.length)
  })

  it('should set decoded provider short description', () => {
    expect(model.serviceProvider().shortDescription()).toEqual('St Mary\'s Centre provides a range of services for anyone who has been raped or sexually assaulted')
  })

  it('should set decoded provider description', () => {
    expect(model.serviceProvider().description()).toEqual(`St Mary's Sexual Assault Referral Centre is a not-for-profit organisation.\n\nSet up to support, work with and be an all accepting approach to homelessness. `)
  })

  it('should set decoded provider readonly description', () => {
    expect(model.serviceProvider().readOnlyDescription()).toEqual(`<p>St Mary&#39;s Sexual Assault Referral Centre is a not-for-profit organisation.</p>\n<p>Set up to support, work with and be an all accepting approach to homelessness. </p>\n`)
  })

  it('should set addresses', () => {
    expect(model.serviceProvider().addresses().length).toEqual(2)
  })

  it('should set addresses\' service provider id', () => {
    expect(model.serviceProvider().addresses()[0].serviceProviderId).toEqual('coffee4craig')
  })

  it('should set services', () => {
    expect(model.serviceProvider().services().length).toEqual(1)
  })

  it('should set services\' service provider id', () => {
    expect(model.serviceProvider().services()[0].serviceProviderId).toEqual('coffee4craig')
  })

  it('should set grouped services', () => {
    expect(model.serviceProvider().groupedServices().length).toEqual(3)
  })

  it('should set needs\' service provider id', () => {
    expect(model.serviceProvider().needs()[0].serviceProviderId).toEqual('coffee4craig')
  })

  it('should set link to add address', () => {
    expect(model.serviceProvider().addAddressUrl).toEqual('/add-service-provider-address.html?providerId=coffee4craig')
  })

  it('should set link to manage services', () => {
    expect(model.serviceProvider().addServiceUrl).toEqual('/add-service-provider-service.html?providerId=coffee4craig')
  })

  it('should set link to manage needs', () => {
    expect(model.serviceProvider().addNeedUrl).toEqual('/add-service-provider-need.html?providerId=coffee4craig')
  })

  it('- Should have initial collection of available tags', () => {
    expect(Object.keys(model.serviceProvider().tags()).length).toEqual(5)
    expect(model.serviceProvider().tags()[0].name).toEqual('Tag A')
    expect(model.serviceProvider().tags()[1].name).toEqual('Tag B')
    expect(model.serviceProvider().tags()[2].name).toEqual('Tag C')
    expect(model.serviceProvider().tags()[3].name).toEqual('Tag D')
    expect(model.serviceProvider().tags()[4].name).toEqual('Tag E')
  })

  it('- Should set flags for each available tag', () => {
    expect(model.serviceProvider().tags()[0].isSelected()).toBeTruthy()
    expect(model.serviceProvider().tags()[1].isSelected()).toBeFalsy()
    expect(model.serviceProvider().tags()[2].isSelected()).toBeTruthy()
    expect(model.serviceProvider().tags()[3].isSelected()).toBeTruthy()
    expect(model.serviceProvider().tags()[4].isSelected()).toBeFalsy()
  })

  it('- Should set need categories', () => {
    expect(model.serviceProvider().needCatList()).toEqual('cat a, cat b')
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'associatedCityId': 'manchester',
    'isVerified': false,
    'isPublished': true,
    'shortDescription': 'St Mary&#39;s Centre provides a range of services for anyone who has been raped or sexually assaulted',
    'description': 'St Mary&#39;s Sexual Assault Referral Centre is a not-for-profit organisation.\n\nSet up to support, work with and be an all accepting approach to homelessness. ',
    'establishedDate': '0001-01-03T00:00:00.0000000Z',
    'areaServiced': 'Manchester & South Wales',
    'email': 'risha@coffee4craig.com',
    'telephone': '07973955003',
    'website': 'http://www.coffee4craig.com/',
    'facebook': 'https://www.facebook.com/Coffee4Craig/?fref=ts',
    'twitter': '@Coffee4Craig',
    'needCategories': ['cat a', 'cat b'],
    'addresses': [{
      'key': '1234',
      'street': '7-11 Lancaster Rd',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Salford',
      'postcode': 'M6 8AQ'
    }, {
      'key': '5678',
      'street': 'Manchester Picadilly',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': null,
      'postcode': 'M1 1AF'
    }],
    'groupedServices': [
      {
        'id': '57bdb2c58705422ecc65724f',
        'categoryId': 'services',
        'categoryName': 'Personal Services',
        'categorySynopsis': null,
        'info': null,
        'tags': null,
        'location': {
          'description': '',
          'streetLine1': 'Flat 713',
          'streetLine2': '37 Potato Wharf',
          'streetLine3': '',
          'streetLine4': '',
          'city': 'Manchester',
          'postcode': 'M3 4BD',
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
            'id': 'haircut',
            'name': 'Haircuts'
          }
        ]
      },
      {
        'id': '57bdb2c58705422ecc657250',
        'categoryId': 'items',
        'categoryName': 'Personal Items',
        'categorySynopsis': null,
        'info': null,
        'tags': null,
        'location': {
          'description': '',
          'streetLine1': 'Flat 713',
          'streetLine2': '37 Potato Wharf',
          'streetLine3': '',
          'streetLine4': '',
          'city': 'Manchester',
          'postcode': 'M3 4BD',
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
        'serviceProviderId': null,
        'serviceProviderName': null,
        'isPublished': false,
        'subCategories': [
          {
            'id': 'clothes',
            'name': 'Clothes'
          },
          {
            'id': 'towels',
            'name': 'Towels'
          }
        ]
      },
      {
        'id': '57bdb2c58705422ecc657253',
        'categoryId': 'support',
        'categoryName': 'Support',
        'categorySynopsis': null,
        'info': null,
        'tags': null,
        'location': {
          'description': '',
          'streetLine1': 'Flat 713',
          'streetLine2': '37 Potato Wharf',
          'streetLine3': '',
          'streetLine4': '',
          'city': 'Manchester',
          'postcode': 'M3 4BD',
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
        'serviceProviderId': null,
        'serviceProviderName': null,
        'isPublished': false,
        'subCategories': [
          {
            'id': 'lgbt',
            'name': 'LGBT support'
          },
          {
            'id': 'housing',
            'name': 'Housing support'
          }
        ]
      }
    ],
    'providedServices': [{
      'key': '569d2b468705432268b65c75',
      'name': 'Meals',
      'info': 'Breakfast',
      'openingTimes': [{
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Monday'
      }, {
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Tuesday'
      }],
      'address': {
        'key': '7a6ff0f3-5b04-4bd9-b088-954e473358f5',
        'street': 'Booth Centre',
        'street1': null,
        'street2': 'Edward Holt House',
        'street3': 'Pimblett Street',
        'city': 'Manchester',
        'postcode': 'M3 1FU',
        'openingTimes': null
      },
      'tags': ['some tags']
    }],
    'needs': [{
      'id': '56ca227f92855621e8d60318',
      'description': 'some new description.',
      'serviceProviderId': 'coffee4craig'
    }],
    'tags': ['tag-a', 'tag-c', 'tag-d']
  }
}
