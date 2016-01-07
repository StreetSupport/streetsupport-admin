describe("Player", function() {
  var Login = require('../../src/js/models/Login')
  var login

  beforeEach(function() {
    login = new Login()
  })

  it("should set initial message", function() {
    expect(login.message).toEqual('hellorld')
  })
})
