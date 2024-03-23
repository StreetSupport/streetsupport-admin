/*
global ga, history, window
*/

'use strict'

const Spinner = require('spin.js')
const adminUrls = require('./admin-urls')

const redirect = (url) => {
  if (url === adminUrls.login && window.location.pathname !== adminUrls.passwordReset + '/') {
    window.location.href = adminUrls.login + '?redirectUrl=' + window.location.href
  } else {
    window.location.href = url
  }
}

let loaderAnim
const getLoader = () => {
  if (loaderAnim === undefined) {
    loaderAnim = new Spinner()
  }
  return loaderAnim
}

const getBody = () => {
  return document.getElementsByTagName('body')[0]
}

var loading = function () {
  getBody().className += ' page-loading'
  getLoader().spin(document.getElementById('spin'))
}

var loaded = function () {
  getBody().className = getBody().className.replace('page-loading', '')
  getLoader().stop()
}

const trackEvent = (src, action, description) => {
  ga('send', 'event', src, action, description)
}

const pushHistory = (stateObject, title, url) => {
  history.pushState(stateObject, title, url)
}

const popHistory = () => {
  history.back()
}

const setOnHistoryPop = (onPopCallback) => {
  window.onpopstate = () => {
    onPopCallback()
  }
}

const scrollTo = function (selector) {
  const findPos = (obj) => {
    var curtop = 0
    if (obj.offsetParent) {
      do {
        curtop += obj.offsetTop
      } while (obj === obj.offsetParent)
      return [curtop]
    }
  }
  const element = document.querySelector(selector)
  window.scroll(0, findPos(element))
}

const origin = () => {
  return window.location.origin
}

const search = () => {
  return window.location.search
}

const refresh = () => {
  window.location.reload()
}

module.exports = {
  redirect,
  loading,
  loaded,
  trackEvent,
  pushHistory,
  popHistory,
  setOnHistoryPop,
  scrollTo,
  origin,
  search,
  refresh
}
