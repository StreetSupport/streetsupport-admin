/* global XMLHttpRequest */

var Q = require('q')
var browser = require('./browser')
import storage from './sessionStorage'
import { storageKeys } from './models/auth0/webAuth'

var postFile = function (url, data, isCustomErrorHandling) {
  return makeRequest({
    method: 'POST',
    url: url,
    data: data,
    isCustomErrorHandling: isCustomErrorHandling
  }, true).promise
}

var post = function (url, data, isCustomErrorHandling) {
  return makeRequest({
    method: 'POST',
    url: url,
    data: data,
    isCustomErrorHandling: isCustomErrorHandling
  }).promise
}

var putFile = function (url, data, isCustomErrorHandling) {
  return makeRequest({
    method: 'PUT',
    url: url,
    data: data
  }, true).promise
}

var put = function (url, data) {
  return makeRequest({
    method: 'PUT',
    url: url,
    data: data
  }).promise
}

var patch = function (url, data) {
  return makeRequest({
    method: 'PATCH',
    url: url,
    data: data
  }).promise
}

var get = function (url) {
  return makeRequest({
    method: 'GET',
    url: url
  }).promise
}

var _delete = function (url) {
  return makeRequest({
    method: 'DELETE',
    url: url
  }).promise
}

var makeRequest = function (options, isMultipartFormData = false) {
  var deferred = Q.defer()
  var req = new XMLHttpRequest()
  req.open(options.method, options.url, true)

  req.setRequestHeader('Authorization', 'Bearer ' + storage.get(storageKeys.accessToken))

  if (!isMultipartFormData) {
    req.setRequestHeader('content-type', 'application/json')
  }

  var parseResponseText = function (response) {
    if (response.responseText.length) {
      var parsed = JSON.parse(response.responseText)
      return parsed
    }
    return {}
  }

  req.onload = function () {
    if (this.status === 201) {
      deferred.resolve({
        'status': 'created',
        'statusCode': this.status,
        'data': parseResponseText(this)
      })
    } else if (this.status === 200) {
      deferred.resolve({
        'status': 'ok',
        'statusCode': this.status,
        'data': parseResponseText(this)
      })
    } else if (this.status === 400) {
      deferred.resolve({
        'status': 'badrequest',
        'statusCode': this.status,
        'data': parseResponseText(this)
      })
    } else if (this.status === 401 && !options.isCustomErrorHandling) {
      browser.redirect(`/login?redirectUrl=${window.location}`)
    } else if (this.status === 403 && !options.isCustomErrorHandling) {
      browser.redirect('/403.html')
    } else {
      deferred.resolve({
        'status': 'error',
        'statusCode': this.status,
        'data': parseResponseText(this)
      })
    }
  }

  req.onerror = function () {
    deferred.reject(new Error('Server responded with a status of ' + req.status))
  }

  if (isMultipartFormData && options.data !== undefined) {
    req.send(options.data)
  } else if (options.data !== undefined) {
    req.send(JSON.stringify(options.data))
  } else {
    req.send()
  }

  return deferred
}
module.exports = {
  get: get,
  post: post,
  patch: patch,
  put: put,
  delete: _delete,
  postFile: postFile,
  putFile: putFile
}
