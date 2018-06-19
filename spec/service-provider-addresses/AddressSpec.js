/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let sinon = require('sinon')
let ajax = require('../../src/js/ajax')
let browser = require('../../src/js/browser')
let endpoints = require('../../src/js/api-endpoints')
let cookies = require('../../src/js/cookies')
let getUrlParameter = require('../../src/js/get-url-parameter')

describe('Address', () => {
  let Model = require('../../src/js/models/Address')
  let model = null

  beforeEach(() => {
    model = new Model(getAddressData())
  })

  it('should format addresses', () => {
    expect(model.formatted).toEqual('5 Oak Street, Manchester, M4 5JD')
  })

  it('should set link to edit each address', () => {
    expect(model.editAddressUrl).toEqual('/edit-service-provider-address.html?providerId=coffee4craig&addressId=1234')
  })

  it('should set link to add an address', () => {
    expect(model.addAddressUrl).toEqual('/add-service-provider-address.html?providerId=coffee4craig')
  })

  it('should set link to delete an address', () => {
    expect(model.deleteAddressUrl).toEqual('/delete-service-provider-address.html?providerId=coffee4craig&addressId=1234')
  })

  describe('Editing', () => {
    beforeEach(() => {
      model.edit()
    })

    it('should set isEditing to true', () => {
      expect(model.isEditing).toBeTruthy()
    })

    describe('Cancel', () => {
      beforeEach(() => {
        model.street1('new street1')
        model.street2('new street2')
        model.street3('new street3')
        model.street4('new street4')
        model.city('new city')
        model.postcode('new postcode')
        model.telephone('new telephone')
        model.openingTimes()[1].startTime('20:00')
        model.openingTimes()[1].endTime('22:00')
        model.openingTimes()[1].day('Wednesday')
        model.cancel()
      })

      it('should set isEditing to false', () => {
        expect(model.isEditing()).toBeFalsy()
      })

      it('should set reset fields', () => {
        expect(model.street1()).toEqual('5 Oak Street')
        expect(model.street2()).toEqual('')
        expect(model.street3()).toEqual('')
        expect(model.street4()).toEqual('')
        expect(model.city()).toEqual('Manchester')
        expect(model.postcode()).toEqual('M4 5JD')
        expect(model.telephone()).toEqual('')
        expect(model.openingTimes()[1].startTime()).toEqual('10:00')
        expect(model.openingTimes()[1].endTime()).toEqual('16:30')
        expect(model.openingTimes()[1].day()).toEqual('Tuesday')
      })
    })

    describe('Save', () => {
      var stubbedApi

      beforeEach(() => {
        let fakeResolved = {
          then: (success, _) => {
            success({
              'statusCode': 200,
              'data': getAddressData()
            })
          }
        }

        stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved)
        sinon.stub(cookies, 'get').returns('stored-session-token')
        sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

        model.street1('new street1')
        model.street2('new street2')
        model.street3('new street3')
        model.street4('new street4')
        model.city('new city')
        model.postcode('new postcode')
        model.telephone('new telephone')
        model.openingTimes()[0].startTime('12:00')
        model.openingTimes()[0].endTime('16:30')
        model.openingTimes()[0].day('Monday')
        model.openingTimes()[1].startTime('12:00')
        model.openingTimes()[1].endTime('15:30')
        model.openingTimes()[1].day('Tuesday')

        model.save()
      })

      afterEach(() => {
        ajax.put.restore()
        cookies.get.restore()
        getUrlParameter.parameter.restore()
      })

      it('should put address details to api with session token', () => {
        var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses/1234'
        var payload = {
          'Street': 'new street1',
          'Street1': 'new street2',
          'Street2': 'new street3',
          'Street3': 'new street4',
          'City': 'new city',
          'Postcode': 'new postcode',
          'IsOpen247': false,
          'Telephone': 'new telephone',
          'OpeningTimes': [{
            'startTime': '12:00',
            'endTime': '16:30',
            'day': 'Monday'
          }, {
            'startTime': '12:00',
            'endTime': '15:30',
            'day': 'Tuesday'
          }]
        }

        var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
      })

      it('should set isEditing to false', () => {
        expect(model.isEditing()).toBeFalsy()
      })

      describe('Edit again and Cancel', () => {
        beforeEach(() => {
          model.edit()
          model.street1('another new street1')
          model.cancel()
        })

        it('should set isEditing to false', () => {
          expect(model.isEditing()).toBeFalsy()
        })

        it('should set reset fields', () => {
          expect(model.street1()).toEqual('new street1')
        })
      })
    })

    describe('Save Fail', () => {
      beforeEach(() => {
        let fakeResolved = {
          then: (result, error) => {
            result({
              'statusCode': 400,
              'response': JSON.stringify({
                'messages': ['returned error message 1', 'returned error message 2']
              })
            })
          }
        }

        sinon.stub(browser, 'scrollTo')
        sinon.stub(ajax, 'put').returns(fakeResolved)
        sinon.stub(cookies, 'get').returns('stored-session-token')
        sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

        model.street1('new street1')

        model.save()
      })

      afterEach(() => {
        ajax.put.restore()
        browser.scrollTo.restore()
        cookies.get.restore()
        getUrlParameter.parameter.restore()
      })

      it('should set message as joined error messages', () => {
        expect(model.errors()[0]).toEqual('returned error message 1')
        expect(model.errors()[1]).toEqual('returned error message 2')
      })

      it('should keep isEditing as true', () => {
        expect(model.isEditing()).toBeTruthy()
      })
    })
  })
})

function getAddressData () {
  return {
    'serviceProviderId': 'coffee4craig',
    'key': 1234,
    'street': '5 Oak Street',
    'street1': '',
    'street2': null,
    'street3': null,
    'city': 'Manchester',
    'postcode': 'M4 5JD',
    'telephone': '',
    'openingTimes': [{
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Monday'
    }, {
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Tuesday'
    }]
  }
}
