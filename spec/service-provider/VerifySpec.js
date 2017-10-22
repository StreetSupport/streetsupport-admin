/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')
var spTags = require('../../src/js/serviceProviderTags')

describe('Service Provider - Verify', () => {
  var Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  var model
  var stubbedPutApi

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    stubbedPutApi = sinon.stub(ajax, 'put')
      .returns({
        then: function (success, error) {
          success({
            'status': 200
          })
        }
      })

    sinon.stub(cookies, 'get').returns('stored-session-token')
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

    model.serviceProvider().verifyOrg()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.put.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
    spTags.all.restore()
  })

  it('- should send inverse of current isVerified to api', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/is-verified'
    var payload = {
      'IsVerified': true
    }
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce

    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  it('- should invert isVerified', () => {
    expect(model.serviceProvider().isVerified()).toBeTruthy()
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
    'description': 'St Mary&#39;s Sexual Assault Referral Centre Coffee4Craig is a not-for-profit organisation set up to support, work with and be an all accepting approach to homelessness. ',
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
