'use strict'
const auth = require('./auth')

const openElement = '.js-nav-open'
const closeElement = '.js-nav-close'
const overlayElement = '.js-nav-overlay'
const activeClass = 'is-active'

const disableForbiddenLinks = () => {
  const disableRestrictedLinks = (userClaims, requiredClaims) => {
    const hasClaim = (userClaims, requiredClaims) => {
      if (requiredClaims === null) return false
      requiredClaims = requiredClaims.split(',')
      for (let j = 0; j < requiredClaims.length; ++j) {
        if (userClaims.includes(requiredClaims[j])) {
          return true
        }
      }
      return false
    }

    const claimsLinks = document.querySelectorAll('[data-claims*="admin"]')
    for (let i = 0; i < claimsLinks.length; ++i) {
      let requiredClaims = claimsLinks[i].getAttribute('data-claims')
      if (!hasClaim(userClaims, requiredClaims)) { claimsLinks[i].classList.add('hide') }
    }
  }

  disableRestrictedLinks(auth.getUserClaims())
}

const initEventListeners = () => {
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

const init = function () {
  initEventListeners()
  disableForbiddenLinks()
}

const open = function () {
  var el = document.querySelectorAll('.js-nav-container, .js-nav-push, .js-nav-overlay, html, body')
  for (let i = 0; i < el.length; ++i) {
    el[i].classList.add(activeClass)
  }
}

const close = function () {
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
