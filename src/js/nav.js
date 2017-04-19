'use strict'
var cookies = require('./cookies')

var openElement = '.js-nav-open'
var closeElement = '.js-nav-close'
var overlayElement = '.js-nav-overlay'
var activeClass = 'is-active'

const disableForbiddenLinks = () => {
  const getUserClaims = () => {
    let userClaims = cookies.get('auth-claims')
    if (userClaims === undefined) userClaims = ''
    return userClaims.toLowerCase()
  }

  const disableRestrictedLinks = (userClaims, requiredClaims) => {
    const hasClaim = (userClaims, requiredClaims) => {
      if (requiredClaims === null) return false
      requiredClaims = requiredClaims.split(',')
      for (let j = 0; j < requiredClaims.length; ++j) {
        if (userClaims.indexOf(requiredClaims[j]) >= 0) {
          return true
        }
      }
      return false
    }

    let claimsLinks = document.querySelectorAll('[data-claims*="admin"]')

    for (let i = 0; i < claimsLinks.length; ++i) {
      let requiredClaims = claimsLinks[i].getAttribute('data-claims')
      if (!hasClaim(userClaims, requiredClaims)) { claimsLinks[i].classList.add('hide') }
    }
  }

  let userClaims = getUserClaims()
  if (userClaims !== 'superadmin') disableRestrictedLinks(userClaims)
}

let initEventListeners = () => {
  document.querySelector(openElement).addEventListener('click', function (e) {
    open()
  })

  document.querySelector(closeElement).addEventListener('click', function (e) {
    close()
  })

  document.querySelector(overlayElement).addEventListener('click', function (e) {
    close()
  })
}

var init = function () {
  initEventListeners()
  disableForbiddenLinks()
}

var open = function () {
  var el = document.querySelectorAll('.js-nav-container, .js-nav-push, .js-nav-overlay, html, body')
  for (let i = 0; i < el.length; ++i) {
    el[i].classList.add(activeClass)
  }
}

var close = function () {
  var el = document.querySelectorAll('.js-nav-container, .js-nav-push, .js-nav-overlay, html, body')
  for (let i = 0; i < el.length; ++i) {
    el[i].classList.remove(activeClass)
  }
}

module.exports = {
  init: init,
  open: open,
  close: close,
  disableForbiddenLinks: disableForbiddenLinks
}
