var sinon = require('sinon'),
    sinonPromise = require('sinon-promise'),
    proxyquire = require('proxyquire'),
    api = require('../../src/js/get-api-data'),
    cookies = require('browser-cookies')



describe('Login', function () {
  var Login = proxyquire('../../src/js/models/Login', {
    'q': sinonPromise.Q
  })
  var login


  beforeEach(function () {
    login = new Login()
    sinonPromise(sinon)
  })

  it('should set username as empty', function () {
    expect(login.username).toEqual('')
  })

  it('should set password as empty', function () {
    expect(login.password).toEqual('')
  })

  describe('Submit happy path', function() {
    var mockCookies

    beforeEach(function () {
      function fakeResolved(value) {
          return {
              then: function(callback) {
                callback()
                return {
                  'statusCode': 201,
                  'data': {
                    'sessionToken': 'sessionToken'
                  }
                }
              }
          }
      }

      sinon.stub(api, 'postData').returns(fakeResolved())

      mockCookies = sinon.mock(cookies)
      mockCookies.expects('set').once()

      login.username = 'username'
      login.password = 'password'

      login.submit()
    })

    afterEach(function () {
      api.postData.restore()
      mockCookies.restore()
    })

    it('should save session token to cookie', function() {
      mockCookies.verify()
    })
  })

})
