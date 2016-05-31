var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Show Service Provider', () => {
  var Model = require('../../src/js/models/ServiceProvider'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach(() => {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': coffee4Craig()
          })
        }
      }
    }
    sinon.stub(ajax, 'delete').returns(fakeResolved ())
    sinon.stub(ajax, 'get').returns(fakeResolved ())
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.serviceProvider().needs()[0].deleteNeed()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.delete.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
  })

  it('should remove need from collection', () => {
    expect(model.serviceProvider().needs().length).toEqual(1)
  })

  it('should keep expected need', () => {
    expect(model.serviceProvider().needs()[0].id()).toEqual('b')
  })
})

function coffee4Craig() {
  return {
    "key": "coffee4craig",
    "name": "Coffee 4 Craig",
    "isVerified": false,
    "isPublished": true,
    "description": "Coffee4Craig is a not-for-profit organisation set up to support, work with and be an all accepting approach to homelessness. ",
    "establishedDate": "0001-01-03T00:00:00.0000000Z",
    "areaServiced": "Manchester & South Wales",
    "email": "risha@coffee4craig.com",
    "telephone": "07973955003",
    "website": "http://www.coffee4craig.com/",
    "facebook": "https://www.facebook.com/Coffee4Craig/?fref=ts",
    "twitter": "@Coffee4Craig",
    "addresses": [
    {
      "key": "1234",
      "street": "7-11 Lancaster Rd",
      "street1": null,
      "street2": null,
      "street3": null,
      "city": "Salford",
      "postcode": "M6 8AQ"
    },
    {
      "key": "5678",
      "street": "Manchester Picadilly",
      "street1": null,
      "street2": null,
      "street3": null,
      "city": null,
      "postcode": "M1 1AF"
    }
    ],
    "providedServices": [],
    "needs": [
      {"id":"a","description":"test","serviceProviderId":"coffee4craig"},
      {"id":"b","description":"test2","serviceProviderId":"coffee4craig"}
    ]
  }
}
