/*
global ga, history, window
*/

'use strict'

let Spinner = require('spin.js')

let redirect = (url) => {
  window.location = url
}

let loaderAnim
let getLoader = () => {
  if (loaderAnim === undefined) {
    loaderAnim = new Spinner()
  }
  return loaderAnim
}

let getBody = () => {
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

let trackEvent = (src, action, description) => {
  ga('send', 'event', src, action, description)
}

let pushHistory = (stateObject, title, url) => {
  history.pushState(stateObject, title, url)
}

let popHistory = () => {
  history.back()
}

let setOnHistoryPop = (onPopCallback) => {
  window.onpopstate = () => {
    onPopCallback()
  }
}

let scrollTo = function (selector) {
  let findPos = (obj) => {
    var curtop = 0
    if (obj.offsetParent) {
      do {
        curtop += obj.offsetTop
      } while (obj === obj.offsetParent)
      return [curtop]
    }
  }
  let element = document.querySelector(selector)
  window.scroll(0, findPos(element))
}

module.exports = {
  redirect: redirect,
  loading: loading,
  loaded: loaded,
  trackEvent: trackEvent,
  pushHistory: pushHistory,
  popHistory: popHistory,
  setOnHistoryPop: setOnHistoryPop,
  scrollTo: scrollTo
}
