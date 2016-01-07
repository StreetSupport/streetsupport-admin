/* global XMLHttpRequest */

var Q = require('q')

var getApiData = function (url) {
  var deferred = Q.defer()
  var req = new XMLHttpRequest()

  req.open('GET', url, true)

  req.onload = function () {
    if (this.status === 200) {
      var json = JSON.parse(req.responseText)
      deferred.resolve({
        'status': 'ok',
        'data': json
      })
    } else {
      deferred.resolve({
        'status': 'error',
        'statusCode': this.status,
        'message': this.responseText
      })
    }
  }

  req.onerror = function () {
    deferred.reject(new Error('Server responded with a status of ' + req.status))
  }

  req.send()

  return deferred.promise
}

var postApiData = function (url, payload) {
  var deferred = Q.defer()
  deferred.resolve({})
}

module.exports = {
  getData: getApiData,
  postData: postApiData
}
