/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const auth = require('../../src/js/auth')
const endpoints = require('../../src/js/api-endpoints')
const browser = require('../../src/js/browser')
const moment = require('moment')
const ko = require('knockout')

describe('PublishedServiceProviders', () => {
  const Dashboard = require('../../src/js/models/service-providers/listing')
  let dashboard

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': {
            items: [
              {
                'key': 'albert-kennedy-trust',
                'name': 'Albert Kennedy Trust',
                'isPublished': true
              },
              {
                'key': 'coffee4craig',
                'name': 'Coffee4Craig',
                'isPublished': false
              }
            ]
          }
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(auth, 'getLocationsForUser').returns([])
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'pushHistory')
    sinon.stub(browser, 'search')
    sinon.stub(browser, 'refresh')

    dashboard = new Dashboard()
    sinon.stub(dashboard, 'note').returns({
      creationDate: ko.observable(moment()),
      date: ko.observable(moment().format('YYYY-MM-DD')),
      staffName: ko.observable('staff'),
      reason: ko.observable('reason'),
      isToday: ko.observable(true)
    })
  })

  afterEach(() => {
    ajax.get.restore()
    auth.getLocationsForUser.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.pushHistory.restore()
    browser.search.restore()
    browser.refresh.restore()
  })

  it('should set published labels', () => {
    expect(dashboard.items()[0].publishedLabel()).toEqual('published')
  })

  it('should set un-published labels', () => {
    expect(dashboard.items()[1].publishedLabel()).toEqual('disabled')
  })

  it('should set toggle publish button labels', () => {
    expect(dashboard.items()[0].togglePublishButtonLabel()).toEqual('disable')
    expect(dashboard.items()[1].togglePublishButtonLabel()).toEqual('publish')
  })

  describe('Toggle Published status', () => {
    let stubbedPutApi

    beforeEach(() => {
      let fakePostResolved = {
        then: function (success, error) {
          success({
            'status': 200,
            'data': {}
          })
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakePostResolved)
      dashboard.toggleNotesInput(dashboard.items()[0])
      dashboard.togglePublished()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should send inverse of current isPublished to api', () => {
      var endpoint = endpoints.getServiceProviders + '/albert-kennedy-trust/is-published'
      var payload = {
        'IsPublished': false,
        'Note': {
          CreationDate: dashboard.note().creationDate(),
          Date: new Date(dashboard.note().date()),
          StaffName: dashboard.note().staffName(),
          Reason: dashboard.note().reason(),
          IsToday: dashboard.note().isToday()
        }
      }

      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should invert isPublished', () => {
      expect(dashboard.items()[0].isPublished()).toBeFalsy()
    })

    it('should set published labels', () => {
      expect(dashboard.items()[0].publishedLabel()).toEqual('disabled')
    })

    it('should set toggle publish button labels', () => {
      expect(dashboard.items()[0].togglePublishButtonLabel()).toEqual('publish')
    })

    it('should set current service provider to null', () => {
      expect(dashboard.currentServiceProvider()).toEqual(null)
    })

    it('should close modal', () => {
      expect(dashboard.isOpenNotesInputModal()).toEqual(false)
    })
  })

    describe('Validate text fields of notes', () => {
      let stubbedPutApi

      beforeEach(() => {
        let fakePostResolved = {
          then: function (success, error) {
            success({
              'status': 200,
              'data': {}
            })
          }
        }
        
        dashboard.note().reason(null)
        stubbedPutApi = sinon.stub(ajax, 'put').returns(fakePostResolved)
        dashboard.toggleNotesInput(dashboard.items()[0])
        dashboard.togglePublished()
      })

      afterEach(() => {
        ajax.put.restore()
      })


      it('show error if required field is empty', () => {
        expect(dashboard.errorMessage()).toEqual('Please fill all fields')
      })
  })

  describe('Validate date fields of notes', () => {
    let stubbedPutApi

    beforeEach(() => {
      let fakePostResolved = {
        then: function (success, error) {
          success({
            'status': 200,
            'data': {}
          })
        }
      }
      
      dashboard.note().date(moment('2020-11-11'))
      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakePostResolved)
      dashboard.toggleNotesInput(dashboard.items()[0])
      dashboard.togglePublished()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('show error if date is in the past', () => {
      expect(dashboard.errorMessage()).toEqual('Date can not be in the past')
    })
  })
})
