
  /*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const ko = require('knockout')
const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const endpoints = require('../../src/js/api-endpoints')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Grouped Service', () => {
  const Model = require('../../src/js/models/GroupedService')
  let model = null

  beforeEach(() => {
    model = new Model(getData())
  })

  it('should set link to edit each service', () => {
    expect(model.editServiceUrl).toEqual('/edit-service-provider-service.html?providerId=coffee4craig&serviceId=57bdb2c58705422ecc65724f')
  })

  describe('Editing', () => {
    describe('Save', () => {
      let stubbedApi = null

      beforeEach(() => {
        const fakeResolved = {
          then: function (success, error) {
            success({
              'statusCode': 200,
              'data': getData()
            })
          }
        }

        stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved)
        sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

        model.info('new info')
        model.tags('new tags, tag 2')
        model.openingTimes()[0].startTime('20:00')
        model.openingTimes()[0].endTime('22:00')
        model.openingTimes()[0].day('Wednesday')
        model.address.street1('new street 1')
        model.address.street2('new street 2')
        model.address.street3('new street 3')
        model.address.street4('new street 4')
        model.address.city('new city')
        model.address.postcode('new postcode')
        model.address.telephone('new telephone')
        model.isOpen247(true)
        model.isTelephoneService(true)
        model.isAppointmentOnly(true)
        model.subCategories()[0] = {
          id: ko.observable('subcat1'),
          isSelected: ko.observable(false)
        }
        model.subCategories()[1] = {
          id: ko.observable('subcat2'),
          isSelected: ko.observable(true)
        }
        model.clientGroups = ko.observableArray()

        model.save()
      })

      afterEach(() => {
        ajax.put.restore()
        getUrlParameter.parameter.restore()
      })

      it('should put service details with new to api', () => {
        var endpoint = endpoints.getServiceProviders + '/coffee4craig/services/57bdb2c58705422ecc65724f'

        var payload = {
          'Info': 'new info',
          'Tags': [
            'new tags',
            'tag 2'
          ],
          'OpeningTimes': [
            {
              'StartTime': '20:00',
              'EndTime': '22:00',
              'Day': 'Wednesday'
            }
          ],
          'LocationDescription': '',
          'Street1': 'new street 1',
          'Street2': 'new street 2',
          'Street3': 'new street 3',
          'Street4': 'new street 4',
          'City': 'new city',
          'Postcode': 'new postcode',
          'Telephone': 'new telephone',
          'IsOpen247': true,
          'IsTelephoneService': true,
          'IsAppointmentOnly': true,
          SubCategories: ['subcat2'],
          ClientGroupKeys: []
        }

        var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce

        expect(apiCalledWithExpectedArgs).toBeTruthy()
      })
    })

    describe('Save with empty tags', () => {
      let stubbedApi = null

      beforeEach(() => {
        const fakeResolved = {
          then: function (success, error) {
            success({
              'statusCode': 200,
              'data': getData()
            })
          }
        }

        sinon.stub(browser, 'scrollTo')
        stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved)
        sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

        model.tags('')

        model.save()
      })

      afterEach(() => {
        ajax.put.restore()
        browser.scrollTo.restore()
        getUrlParameter.parameter.restore()
      })

      it('should put service details with new to api', () => {
        var endpoint = endpoints.getServiceProviders + '/coffee4craig/services/57bdb2c58705422ecc65724f'
        var payload = {
          'Info': 'info',
          'Tags': [],
          'OpeningTimes': [{
            'StartTime': '10:00',
            'EndTime': '18:00',
            'Day': 'Tuesday'
          }],
          'LocationDescription': '',
          'Street1': 'street 1',
          'Street2': 'street 2',
          'Street3': '',
          'Street4': '',
          'City': 'Manchester',
          'Postcode': 'M1 3FY',
          'Telephone': 'telephone',
          'IsOpen247': false,
          'IsTelephoneService': false,
          'IsAppointmentOnly': false,
          'SubCategories': [],
          'ClientGroupKeys': ['cg-1']
        }

        var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
      })
    })

    describe('Save Fail', () => {
      beforeEach(() => {
        const fakeResolved = {
          then: function (success, error) {
            success({
              'statusCode': 400,
              'data': {
                'messages': ['returned error message 1', 'returned error message 2']
              }
            })
          }
        }

        sinon.stub(ajax, 'put').returns(fakeResolved)
        sinon.stub(browser, 'scrollTo')
        sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

        model.info('new info')

        model.save()
      })

      afterEach(() => {
        ajax.put.restore()
        browser.scrollTo.restore()
        getUrlParameter.parameter.restore()
      })

      it('should set message as joined error messages', () => {
        expect(model.errors()[0]).toEqual('returned error message 1')
        expect(model.errors()[1]).toEqual('returned error message 2')
      })
    })
  })
})

function getData () {
  return {
    'id': '57bdb2c58705422ecc65724f',
    'categoryId': 'services',
    'categoryName': 'Personal Services',
    'categorySynopsis': null,
    'info': 'info',
    'tags': null,
    'telephone': 'telephone',
    'location': {
      'description': '',
      'streetLine1': 'street 1',
      'streetLine2': 'street 2',
      'streetLine3': '',
      'streetLine4': '',
      'city': 'Manchester',
      'postcode': 'M1 3FY',
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
    ],
    'clientGroupKeys': ['cg-1']
  }
}
