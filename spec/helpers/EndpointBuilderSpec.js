describe('Endpoint Builder', () => {
  var Builder = require('../../src/js/endpoint-builder')
  var stu
  var result

  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  }

  beforeEach(() => {
    stu = new Builder()
  })

  describe('get Service Providers', () => {
    beforeEach(() => {
      result = stu.serviceProviders().build()
    })

    it('should build get all Service Providers endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers')).toBeTruthy()
    })
  })

  describe('get specific Service Provider', () => {
    beforeEach(() => {
      result = stu.serviceProviders('provider-a').build()
    })

    it('should build endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers/provider-a')).toBeTruthy()
    })
  })

  describe('get specific service provider is verified', () => {
    beforeEach(() => {
      result = stu.serviceProviders('provider-a').isVerified().build()
    })

    it('should build endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers/provider-a/is-verified')).toBeTruthy(result)
    })
  })

  describe('get specific service provider is published', () => {
    beforeEach(() => {
      result = stu.serviceProviders('provider-a').isPublished().build()
    })

    it('should build endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers/provider-a/is-published')).toBeTruthy(result)
    })
  })

  describe('get specific service provider contact details', () => {
    beforeEach(() => {
      result = stu.serviceProviders('provider-a').contactDetails().build()
    })

    it('should build endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers/provider-a/contact-details')).toBeTruthy(result)
    })
  })

  describe('get specific service provider general information', () => {
    beforeEach(() => {
      result = stu.serviceProviders('provider-a').generalInformation().build()
    })

    it('should build endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers/provider-a/general-information')).toBeTruthy(result)
    })
  })

  describe('get specific service provider addresses', () => {
    beforeEach(() => {
      result = stu.serviceProviders('provider-a').addresses().build()
    })

    it('should build endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers/provider-a/addresses')).toBeTruthy()
    })
  })

  describe('get specific service provider address', () => {
    beforeEach(() => {
      result = stu.serviceProviders('provider-a').addresses('address-a').build()
    })

    it('should build endpoint uri', () => {
      expect(result.endsWith('/v1/all-service-providers/provider-a/addresses/address-a')).toBeTruthy(result)
    })
  })
})
