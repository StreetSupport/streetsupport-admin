/*
global ga, history, window
*/

'use strict'

let Spinner = require('spin.js')

let redirect = (url) => {
  window.location = url
}

let dataLoaded = () => {
  let dynamicElements = document.getElementsByClassName('awaiting-data')
  Array.from(dynamicElements).forEach(element => {
    element.className = element.className.replace(/(?:^|\s)awaiting-data(?!\S)/g, '')
  })
}

let loaderAnim
let getLoader = () => {
  if (loaderAnim === undefined) {
    loaderAnim = new Spinner()
  }
  return loaderAnim
}

let loading = () => {
  getLoader().spin(document.getElementById('spin'))
}

let loaded = () => {
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

module.exports = {
  redirect: redirect,
  loading: loading,
  loaded: loaded,
  trackEvent: trackEvent,
  dataLoaded: dataLoaded, // deprecated
  pushHistory: pushHistory,
  popHistory: popHistory,
  setOnHistoryPop: setOnHistoryPop
}
