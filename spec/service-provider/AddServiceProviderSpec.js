var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies')


describe('Add Service Provider', () => {
  var Model = require('../../src/js/models/AddServiceProvider'),
  model

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    model = new Model()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should start with Name empty', () => {
    expect(model.name()).toEqual('')
  })

  it('should start with errors false', () => {
    expect(model.hasErrors()).toBeFalsy()
  })

  describe('Save', () => {
    var stubbedApi,
        stubbedCookies,
        stubbedBrowser
    beforeEach(() => {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 201,
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      model.name('New Service Provider')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
      browser.redirect.restore()
    })

    it('should post service provider name to api', () => {
        var endpoint = endpoints.getServiceProviders
        var headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        var payload = JSON.stringify({
          'Name': 'New Service Provider'
        })
        var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect to dashboard', () => {
      expect(stubbedBrowser.withArgs(adminurls.dashboard).calledOnce).toBeTruthy()
    })
  })

  describe('Save fail', () => {
    var stubbedApi,
        stubbedCookies,
        stubbedBrowser
    beforeEach(() => {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            error({
              'status': 400,
              'response': JSON.stringify({
                'messages': ['returned error message 1', 'returned error message 2']
              })
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      model.name('New Service Provider')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
      browser.redirect.restore()
    })

    it('set errors in message', () => {
      expect(model.errors()[0]).toEqual('returned error message 1')
      expect(model.errors()[1]).toEqual('returned error message 2')
    })

    it('should not redirect to dashboard', () => {
      expect(stubbedBrowser.withArgs(adminurls.dashboard).notCalled).toBeTruthy()
    })
  })
})
