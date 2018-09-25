/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Delete Service', () => {
  const Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  let model = null

  beforeEach(() => {
    let fakeResolved = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }
    sinon.stub(ajax, 'delete').returns(fakeResolved)
    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.serviceProvider().services()[0].deleteService()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.delete.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should remove Service from collection', () => {
    expect(model.serviceProvider().services().length).toEqual(1)
  })

  it('should keep expected address', () => {
    expect(model.serviceProvider().services()[0].id()).toEqual('5678')
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'isVerified': false,
    'isPublished': true,
    'description': 'Coffee4Craig is a not-for-profit organisation set up to support, work with and be an all accepting approach to homelessness. ',
    'establishedDate': '0001-01-03T00:00:00.0000000Z',
    'areaServiced': 'Manchester & South Wales',
    'email': 'risha@coffee4craig.com',
    'telephone': '07973955003',
    'website': 'http://www.coffee4craig.com/',
    'facebook': 'https://www.facebook.com/Coffee4Craig/?fref=ts',
    'twitter': '@Coffee4Craig',
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
        'serviceProviderId': null,
        'serviceProviderName': null,
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
      'serviceProviderId': 'coffee4craig',
      'key': '1324',
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
    }, {
      'serviceProviderId': 'coffee4craig',
      'key': '5678',
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
    }]
  }
}
