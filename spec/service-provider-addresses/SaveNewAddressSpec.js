/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Save brand new Address', () => {
  var Model = require('../../src/js/models/Address')
  var model

  beforeEach(() => {
    model = new Model({})

    model.edit()
  })

  describe('Save', () => {
    var stubbedApi

    beforeEach(() => {
      let fakeResolved = {
        then: function (success, error) {
          success({
            'statusCode': 201,
            'data': {
              'key': 230680
            }
          })
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved)
      sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
      sinon.stub(browser, 'loading')
      sinon.stub(browser, 'loaded')

      model.street1('new street1')
      model.street2('new street2')
      model.street3('new street3')
      model.street4('new street4')
      model.city('new city')
      model.postcode('new postcode')
      model.telephone('new telephone')
      model.isOpen247(true)

      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      getUrlParameter.parameter.restore()
      browser.loading.restore()
      browser.loaded.restore()
    })

    it('should post address details to api create endpoint with session token', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses'
      var payload = {
        'Street': 'new street1',
        'Street1': 'new street2',
        'Street2': 'new street3',
        'Street3': 'new street4',
        'City': 'new city',
        'Postcode': 'new postcode',
        'Telephone': 'new telephone',
        'OpeningTimes': [],
        'IsOpen247': true
      }

      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set returned key', () => {
      expect(model.key()).toEqual(230680)
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
})

describe('Save new Address as part of collection', () => {
  var Model = require('../../src/js/models/Address')
  var model

  beforeEach(() => {
    model = new Model({
      'tempKey': 'some temp key',
      'openingTimes': []
    })

    model.edit()
  })

  describe('Save', () => {
    var stubbedApi

    beforeEach(() => {
      let fakeResolved = {
        then: function (success, error) {
          success({
            'statusCode': 201,
            'data': {
              'key': 230680
            }
          })
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved)
      sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

      model.street1('new street1')
      model.street2('new street2')
      model.street3('new street3')
      model.street4('new street4')
      model.city('new city')
      model.postcode('new postcode')
      model.telephone('new telephone')
      model.newOpeningTime()
      model.openingTimes()[0].startTime('12:00')
      model.openingTimes()[0].endTime('16:30')
      model.openingTimes()[0].day('Monday')
      model.newOpeningTime()
      model.openingTimes()[1].startTime('12:00')
      model.openingTimes()[1].endTime('15:30')
      model.openingTimes()[1].day('Tuesday')

      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      getUrlParameter.parameter.restore()
    })

    it('should post address details to api create endpoint with session token', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses'
      var payload = {
        'Street': 'new street1',
        'Street1': 'new street2',
        'Street2': 'new street3',
        'Street3': 'new street4',
        'City': 'new city',
        'Postcode': 'new postcode',
        'Telephone': 'new telephone',
        'OpeningTimes': [
          {
            'startTime': '12:00',
            'endTime': '16:30',
            'day': 'Monday'
          }, {
            'startTime': '12:00',
            'endTime': '15:30',
            'day': 'Tuesday'
          }
        ],
        'IsOpen247': false
      }

      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set returned key', () => {
      expect(model.key()).toEqual(230680)
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
})
