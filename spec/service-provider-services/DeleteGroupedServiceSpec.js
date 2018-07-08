/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Delete Service', () => {
  var Model = require('../../src/js/models/GroupedService')
  let model = new Model(getData())
  let stubbedApi = null

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'delete').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

    model.deleteService()
  })

  afterEach(() => {
    ajax.delete.restore()
    getUrlParameter.parameter.restore()
  })

  it('should delete service id to api create endpoint', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/services/57bdb2c58705422ecc65724f'
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })
})

function getData () {
  return {
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
    'serviceProviderId': 'coffee4craig',
    'isPublished': false,
    'subCategories': [
      {
        'id': 'haircut',
        'name': 'Haircuts'
      }
    ]
  }
}
